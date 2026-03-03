---
title: "Kotlin Coroutinesで非同期処理をシンプルに書く"
date: "2025-02-10"
tags: ["Kotlin", "Coroutines", "非同期"]
summary: "コールバック地獄を卒業。Kotlin Coroutinesの基本からFlowまでを実例とともに解説します。"
thumbnail: "/images/blog/kotlin-coroutines.png"
---

## なぜCoroutinesか

非同期処理を書く方法はいくつかありますが、Kotlinでは**Coroutines**が事実上の標準です。

- スレッドより軽量
- `suspend`関数でシンプルに書ける
- `Flow`でリアクティブストリームも対応

## 基本：suspend関数

```kotlin
import kotlinx.coroutines.*

suspend fun fetchUser(id: Long): User {
    delay(100) // ノンブロッキングな待機
    return userRepository.findById(id)
}

fun main() = runBlocking {
    val user = fetchUser(1L)
    println(user.name)
}
```

`delay()` はスレッドをブロックせず、コルーチンを一時停止します。

## 並列実行：async/await

```kotlin
coroutineScope {
    val userDeferred = async { fetchUser(1L) }
    val postsDeferred = async { fetchPosts(1L) }

    val user = userDeferred.await()
    val posts = postsDeferred.await()
    // 両方の結果を使う
}
```

`async` で並列起動 → `await` で結果を受け取ります。

## Flow：ストリーム処理

```kotlin
fun temperatureStream(): Flow<Double> = flow {
    while (true) {
        emit(sensor.read())
        delay(1000)
    }
}

// 消費側
temperatureStream()
    .filter { it > 30.0 }
    .collect { temp ->
        println("高温アラート: $temp°C")
    }
```

## CoroutineScope とキャンセル

```kotlin
class UserViewModel : ViewModel() {
    fun loadUser(id: Long) {
        viewModelScope.launch {
            try {
                val user = fetchUser(id)
                _uiState.value = UiState.Success(user)
            } catch (e: CancellationException) {
                throw e // キャンセルは再スローする
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}
```

## まとめ

Kotlin Coroutinesは学習コストが低く、Spring BootやAndroidどちらでも活躍します。
まずは`suspend`関数と`coroutineScope`から始めてみましょう。
