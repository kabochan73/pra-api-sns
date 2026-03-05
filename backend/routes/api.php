<?php

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
        $posts = Post::with('user')->latest()->get();
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

        return response()->json($post->load('user'), 201);
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

        return response()->json($post->load('user'));
    });

    // 投稿削除
    Route::delete('/posts/{post}', function (Request $request, Post $post) {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $post->delete();

        return response()->json(['message' => '削除しました。']);
    });
});
