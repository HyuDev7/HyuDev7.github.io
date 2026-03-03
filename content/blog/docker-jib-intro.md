---
title: "Docker入門：JibでKotlinアプリをコンテナ化する"
date: "2025-01-15"
tags: ["Docker", "Kotlin", "CI/CD"]
summary: "KotlinアプリをJibでDockerイメージ化する手順を、Dockerfileなしで解説します。"
thumbnail: "/images/blog/docker-jib.png"
---

## はじめに

Kotlinで書いたSpring Bootアプリをコンテナ化したいとき、従来は`Dockerfile`を書く必要がありました。
しかし**Jib**を使えば、Dockerfileなしでイメージをビルド・プッシュできます。

## Jibとは

[Jib](https://github.com/GoogleContainerTools/jib)はGoogleが開発したJVM向けコンテナビルドツールです。

- **Dockerデーモン不要** — Docker未インストールでもビルド可能
- **高速** — レイヤーを差分管理するため再ビルドが速い
- **Gradle/Maven プラグイン** — ビルドツールに統合できる

## セットアップ

`build.gradle.kts` にプラグインを追加します。

```kotlin
plugins {
    id("com.google.cloud.tools.jib") version "3.4.0"
}

jib {
    from {
        image = "eclipse-temurin:21-jre-alpine"
    }
    to {
        image = "ghcr.io/your-username/your-app"
        tags = setOf("latest", project.version.toString())
    }
    container {
        jvmFlags = listOf("-Xms512m", "-Xmx512m")
        ports = listOf("8080")
    }
}
```

## ビルドしてプッシュ

```bash
# レジストリへ直接プッシュ
./gradlew jib

# ローカルのDockerデーモンへビルド（動作確認用）
./gradlew jibDockerBuild
```

## GitHub Actions との連携

```yaml
- name: Build and push image
  run: ./gradlew jib
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## まとめ

JibはKotlin/JVMプロジェクトのコンテナ化を大幅に簡略化してくれます。
特にCI/CDパイプラインでDockerデーモンを使いたくないケースで威力を発揮します。
