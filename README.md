[![Build Status](https://travis-ci.org/whileTrueDev/onadWeb.svg?branch=master)](https://travis-ci.org/hwasurr/onadWeb)

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
- BackEnd: `Node.js`, `Express`
- FrontEnd: `React.js`
- Socket server: `socket.io`
- DB: `mysql`

### 코딩 스타일 - ESlint

- 패키지 관리자로는 [yarn](https://yarnpkg.com) 을 사용한다.
- 코드 품질 관리에는 ESlint(airbnb rule, react hooks rule) + prettier 를 사용한다.
- TSLint는 deprecated 예정이므로 ESLint의 Typescript  플러그인 사용.

#### 설치 및 설정

- 최상위 폴더에서 yarn 을 통해 devDependencies 설치 ( 모두 eslint 및 prettier 관련)
- 우측 상단 `<설정열기>` 클릭한 이후 `settings.json` 에서 다음 설정을 복사 및 붙여넣기.

    ~~~json
    // These are all my auto-save configs
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    // turn it off for JS and JSX, we will do this via eslint
    "[javascript]": {
        "editor.formatOnSave": false,
        "editor.tabSize": 2
    },
    "[javascriptreact]": {
        "editor.formatOnSave": false,
        "editor.tabSize": 2
    },
    ~~~

- 최상위 폴더에 eslint 설정파일인 `.eslintrc` 파일 추가

- eslint 설정은 다음과 같다. 다음 설정을 .eslintrc 파일에 복사한다.

    ~~~json
    {
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "prettier",
        "jest",
        "react-hooks"
    ],
    "extends": [
        "airbnb",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    "settings": {
        "import/extensions": [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
        ],
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts",
                ".tsx"
            ]
        },
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ]
            }
        }
    },
    "rules": {
        "@typescript-eslint/no-var-requires": "warn", // please use import
        "no-case-declarations": "warn", // please use import
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "js": "never",
                "jsx": "never",
                "ts": "never",
                "tsx": "never"
            }
        ],
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
        "no-underscore-dangle": "off",
        "comma-dangle": "off",
        "linebreak-style": [
            "error",
            // "windows" // if you use UNIX OS, remove this
        ],
        "react/require-default-props": 1,
        "no-unused-vars": "warn",
        "button-has-type": 0,
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
        "browser": true,
        "jest": true,
        "es6": true
        }
    }
    ~~~
