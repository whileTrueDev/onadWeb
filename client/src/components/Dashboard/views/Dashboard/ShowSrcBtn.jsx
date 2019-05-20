import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/CustomButtons/Button';

class ShowSrcBtn extends Component {
    state = {
      showSrc: null,
      value: '[주소 보기] 버튼을 누르면 주소가 표시됩니다. 악용될 수 있으니 주소가 유출되지 않도록 주의하세요',
      disabled: false,
      cursor: 'pointer',
    }

    showSrcTimer = (e) => {
      const { showSrc } = this.state;
      if (showSrc != null) {
        clearTimeout(this.showSrcTimer);
        this.setState(
          { showSrc: null },
        );
      }

      this.setState({
        value: 'http://onad.fun',
        disabled: true,
        cursor: 'wait', // 이곳은 왜 작동하지를 않을까?????
        showSrc: setTimeout(this.timeFunction, 10 * 1000),
      });
    }

    timeFunction = () => {
      this.setState({
        disabled: false,
        value: '왼쪽의 [주소 보기]를 누르면 10초간 주소가 보여집니다.',
        cursor: 'pointer',
      });
    }


    render() {
      const style = {
        width: '50%',
      };
      const {
        disabled, cursor, value, src,
      } = this.state;

      return (
        <div style={{ textAlign: 'center' }}>

          {/* 만약 계약을 하였다면 */}
          <Button
            onClick={this.showSrcTimer}
            disabled={disabled}
            style={{ cursor: `${cursor}` }}
          >
          주소보기
          </Button>
          <input
            ref={(ref) => { this.input = ref; }}
            style={style}
            type="text"
            readOnly=""
            value={value}
            hiddenValue={src}
          />

          {/* 계약을 하지 않았다면 */}
          <Button>
            <Link to="/dashboard/user">계약하러가기</Link>
          </Button>

        </div>
      );
    }
}

export default ShowSrcBtn;
