# Router

## Global Router

- Home: /
- Join: /join
- Login: /login
- Logout: /logout
- Search Video: /search

## User Router

- See User: /user/:id
- Edit User: /user/:id/edit
- Change Email: /user/email/change (보류)
- Change Password: /user/password/change
- Upload Avatar: /user/avatar/upload
- Edit Avatar: /user/avatar/edit

## Video Router

- Upload Video: /video/upload
- See Video: /video/:id
- Edit Video: /video/:id/edit
- Delete Video: /video/:id/delete
- Create Comment: /video/:id/comment/create
- Edit Comment: /video/:id/comment/edit
- Delete Comment: /video/:id/comment/delete

## 기타 추가 사항

- 카카오 로그인 또는 구글 로그인 (소셜 로그인 추가)

## join.pug

```pug
   include partials/socialLogin

  form(method="POST")
    input(name="username" type="text" placeholder="이름" required)
    input(name="email" type="email" placeholder="이메일" required)
    input(name="password" type="password" placeholder="비밀번호" required)
    input(name="confirmPassword" type="password" placeholder="비밀번호 확인" required)
    input(type="submit" value="회원가입")

  div
    span 이미 계정이 있으신가요?
    a(href="/login") 로그인
```

## login.pug

```pug
    form(method="POST")
      input(name="email" type="email" placeholder="이메일" required)
      input(name="password" type="password" placeholder="비밀번호" required)
      input(type="submit" value="로그인")
      br
      a(href="/github/auth/start") 깃허브 로그인
      br
      a(href="/kakao/auth/start") 카카오 로그인
```

## upload.pug

```pug
  form(method="POST" enctype="multipart/form-data")
    label(for="video") 비디오
    input(id="video" name="video" type="file" placeholder="비디오" accept="video/*" required)
    input(name="title" type="text" placeholder="제목" required maxlength="20")
    input(name="description" type="text" placeholder="설명" maxlength="100")
    input(name="hashtags" type="text" placeholder="해시태그")
    input(type="submit" value="업로드")
```
