[![Build Status](https://travis-ci.org/hwasurr/onadWeb.svg?branch=master)](https://travis-ci.org/hwasurr/onadWeb)

# onadWeb

react, express, webSocket server for onad platform.

## Contributor

WhileTrue 개발자 [강동기](https://github.com/GoMotiv), [강화수](https://github.com/hwasurr), [박찬우](https://github.com/chanuuuuu), [이진은](https://github.com/leejineun)

## Coding standard

### 개발 스택

- Cloud Service: `AWS`
- Continuous Integration: `Travis-ci`
- Container & Image manage: `Docker`, `docker-compose`
- Package Manager: `yarn`
- BackEnd: `Node.js`
- FrontEnd: `React.js`, `create-react-app`
- Socket server: `socket.io`
- DB: `mysql`

### 코딩 스타일 - ESlint

- 패키지 관리자로는 [yarn](https://yarnpkg.com) 을 사용한다.
- 코드 품질 관리에는 ESlint(airbnb rule) + prettier 를 사용한다.
- eslint 설정은 다음과 같다. (Windows 운영체제의 경우 )

    ~~~json
    {
        "parser": "babel-eslint",
        "parserOptions": {
            "ecmaVersion": 6,
            "sourceType": "module",
            "ecmaFeatures": {
                "jsx": true,
                "modules": true,
                "experimentalObjectRestSpread": true
            }
        },
        "extends": [
            "airbnb"
        ],
        "plugins": [
            "prettier"
        ],
        "rules": {
            "linebreak-style": [
                "error",
            ],
            "react/require-default-props": 1,
            "no-unused-vars": "warn",
            "button-has-type": "null",
            "react/prefer-stateless-function": 1,
            "react/forbid-prop-types": [
                0,
                {
                    "forbid": [
                        "object"
                    ]
                }
            ],
            "react/prop-types": [
                1,
                {
                    "ignore": [
                        "className",
                        "children",
                        "location",
                        "params",
                        "location*"
                    ]
                }
            ]
        },
        "env": {
            "browser": true
        }
    }
    ~~~
