# 아프리카 Note 크롤러

온애드의 아프리카TV 연동을 위한 인정코드 쪽지 크롤러

1. 유저가 연동 요청 버튼 클릭
2. 인증번호를 발급, 크리에이터에게 보여줌
3. 받은 인증번호를 아프리카tv 에서 온애드에게 "쪽지"로 보낸다
4. 온애드 쪽지 크롤러가 주기적으로 쪽지를 확인해 온애드로 보낸 쪽지와 발급된 인증번호를 비교하여 확인하고, 동일한 경우 승인
5. 연동 정보 최신화
    - 중복 연동 처리
      1. 현재 요청하는 아프리카 아이디가 이미 다른 유저에게 연동되어 있는 경우

          ⇒ 발급 안함 + 기존 유저 아이디를 보여주고 문의 요청

      2. 현재 요청하는 아프리카 아이디로의 요청이 이미 있는 경우 (이미 인증번호가 발급된 경우)

          ⇒ 새로 발급하지 않는다. 기존의 발급된 인증번호를 보여준다.

## 실행

```bash
python3 run.py
```

## 빌드

```bash
docker build -t <your-name>/<your-repository>:<tag> .
```

## 빌드된 이미지 실행

```bash
docker run --env-file=.env <your-name>/<your-repository>:<tag>
```