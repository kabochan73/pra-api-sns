<?php

use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json(['token' => $token, 'user' => $user], 201);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['メールアドレスまたはパスワードが正しくありません。'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json(['token' => $token, 'user' => $user]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ログアウトしました。']);
    });

    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    // 投稿一覧
    Route::get('/posts', function (Request $request) {
        $userId = $request->user()->id;
        $posts = Post::with('user')->withCount('likes')
            ->addSelect(['liked_by_me' => Like::selectRaw('COUNT(*)')
                ->whereColumn('post_id', 'posts.id')
                ->where('user_id', $userId)
            ])
            ->latest()
            ->get();
        return response()->json($posts);
    });

    // 投稿作成
    Route::post('/posts', function (Request $request) {
        $request->validate([
            'content' => 'required|string|max:280',
        ]);

        $post = $request->user()->posts()->create([
            'content' => $request->content,
        ]);

        $post->load('user');
        $post->likes_count = 0;
        $post->liked_by_me = 0;

        return response()->json($post, 201);
    });

    // 投稿編集
    Route::put('/posts/{post}', function (Request $request, Post $post) {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $request->validate([
            'content' => 'required|string|max:280',
        ]);

        $post->update(['content' => $request->content]);

        $userId = $request->user()->id;
        $post->load('user');
        $post->likes_count = $post->likes()->count();
        $post->liked_by_me = $post->likes()->where('user_id', $userId)->exists() ? 1 : 0;

        return response()->json($post);
    });

    // いいねトグル
    Route::post('/posts/{post}/like', function (Request $request, Post $post) {
        $userId = $request->user()->id;
        $like = $post->likes()->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
        } else {
            $post->likes()->create(['user_id' => $userId]);
        }

        return response()->json([
            'likes_count' => $post->likes()->count(),
            'liked_by_me' => !$like,
        ]);
    });

    // 投稿削除
    Route::delete('/posts/{post}', function (Request $request, Post $post) {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $post->delete();

        return response()->json(['message' => '削除しました。']);
    });

    // ユーザープロフィール
    Route::get('/users/{id}', function (Request $request, int $id) {
        $authUserId = $request->user()->id;
        $user = User::findOrFail($id);
        $posts = Post::with('user')->withCount('likes')
            ->addSelect(['liked_by_me' => Like::selectRaw('COUNT(*)')
                ->whereColumn('post_id', 'posts.id')
                ->where('user_id', $authUserId)
            ])
            ->where('user_id', $id)
            ->latest()
            ->get();

        return response()->json([
            'user' => ['id' => $user->id, 'name' => $user->name],
            'posts' => $posts,
        ]);
    });
});
