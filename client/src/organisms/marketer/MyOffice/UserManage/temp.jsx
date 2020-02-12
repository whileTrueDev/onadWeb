
)
: (
  <form onSubmit={handleSubmit}>
    <CardBody>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            label="ID"
            value={userData.marketerId}
            className={classes.textField}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={7} />
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            required
            label="PASSWORD"
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요."
            onChange={checkPasswd}
            helperText={state.password ? '특수문자를 포함한 영문/숫자 혼합 8자리 이상입니다.' : ' '}
            error={state.password}
            className={classes.textField}
            margin="normal"
            autoFocus
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            required
            type="password"
            label="RE-PASSWORD"
            placeholder="비밀번호를 재입력하세요."
            helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
            error={state.repasswd}
            onChange={checkRePasswd}
            className={classes.textField}
            margin="normal"
            id="repassword"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            required
            label="NAME"
            value={userData.marketerName}
            className={classes.textField}
            margin="normal"
            id="name2"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={7} />
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            required
            label="MAIL"
            value={userData.marketerMail.split('@')[0]}
            className={classes.textField}
            margin="normal"
            id="mail2"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            required
            select
            label="Domain"
            className={classes.textField}
            value={domain}
            onChange={handleDomainChange}
            margin="normal"
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {domains.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            required
            label="PHONE"
            value={phone}
            onChange={handlePhoneChange}
            className={classes.textField}
            type="tel"
            margin="normal"
            InputProps={{
              inputComponent: TextMaskCustom,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={5} />
        <GridItem xs={12} sm={12} md={2}>
          <TextField
            label="TYPE"
            value={!userData.marketerUserType ? '일반인' : '사업자'}
            className={classes.textField}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
          {userData.marketerUserType
            ? (
              <TextField
                label="COMPANY REGISTRATION NUMBER"
  // value={userData.creatorIp}
                className={classes.textField}
                value={userData.marketerBusinessRegNum}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )
            : <div />
    }
        </GridItem>
      </GridContainer>
    </CardBody>
    <CardFooter>
      <div>
        <Button
          type="submit"
          value="submit"
          color="info"
        >
        확인
        </Button>
        <Button
          // color="info"
          onClick={() => { editType.handleToggle(); }}
        >
        취소
        </Button>
      </div>
    </CardFooter>
  </form>
)
  }
