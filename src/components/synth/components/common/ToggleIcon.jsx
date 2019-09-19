//@ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { HeaderText } from './HeaderText';
import { Group } from 'react-konva';
import { ConnectHook } from '../common-core';

const ToggleImage = (props) => {
  const { on, ...other } = props;
  if (on) {
    return <AssetImage componentScope={'ToggleIcon'} assetName={'toggle-on'} {...other} />;
  } else {
    return <AssetImage componentScope={'ToggleIcon'} assetName={'toggle-off'} {...other} />;
  }
};

ToggleImage.imgWidthPx = 18;
ToggleImage.imgHeightPx = 20;

export class ToggleIcon extends Component {
  state = {
    checked: false,
    img_x: 0,
    img_y: 0,
    txt_x: 0,
    txt_y: 0,
    text: '',
    layoutCompleted: false,
  };

  /**
   * @param {{w: number, h: number, text?: string, checked: boolean, onClick: (checked: boolean) => void, children: React.ReactNode}} props
   */
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleLayout = this.handleLayout.bind(this);

    this.w = this.props.w;
    this.h = this.props.h;
    this.state.checked = props.checked;
    this.state.text = typeof (props.text) === 'string'
      ? props.text
      : (typeof props.children === 'string' && props.children) || this.state.text;
  }

  componentDidMount() {
    this.handleLayout({
      w: ToggleImage.imgWidthPx,
      h: ToggleImage.imgHeightPx,
    });
  }

  componentDidUpdate() {
    const { checked } = this.props;
    if (typeof checked === 'undefined') {
      return;
    }
    if (this.state.checked !== checked) {
      this.handleClick();
    }
  }

  /**
   * @param {{w: number, h: number}} imgInfo
   */
  handleLayout(imgInfo) {
    if (this.state.layoutCompleted) {
      return;
    }
    this.setState(() => {
      return ({
        img_x: this.w / 2 - imgInfo.w / 2,
        img_y: this.h - imgInfo.h,
        txt_x: 0,
        txt_y: this.h - 12 - imgInfo.h,
        layoutCompleted: true,
      });
    });
  }

  handleClick = () => {
    if (this.props.enabled) {
      this.props.onClick && this.props.onClick(!this.state.checked);
      this.setState((state) => {
        return ({
          checked: !state.checked
        });
      });
    }
  }

  render() {
    const { x, y, w } = this.props;
    return (
      <Group x={x} y={y}>
        {/* <Rect width={this.w} height={this.h} fill="black"/> */}
        <ToggleImage
          on={this.state.checked}
          x={this.state.img_x}
          y={this.state.img_y}
          onClick={this.handleClick}
        />
        {this.state.text ? <HeaderText
          x={this.state.txt_x}
          y={this.state.txt_y}
          width={w}
          centered={true}
          fillColour={{ r: 255, g: 255, b: 255, a: 150 }}
        >{this.state.text}</HeaderText> : null}
      </Group>
    );
  }
}

ToggleIcon.propTypes = {
  w: PropTypes.number,
  h: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  enabled: PropTypes.bool,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};

ToggleIcon.defaultProps = {
  w: 44,
  h: 53,
  x: 0,
  y: 0,
  enabled: true,
  checked: undefined,
};

export const ConnectToggle = ({ hook, ...props }) => ConnectHook(hook)(({ value, valueChanged }) => {
  const _value = (hook && (value || value !== 0) && value > 0.5) || false;
  const _valueChanged = checked => valueChanged(+checked);

  return <ToggleIcon {...props} checked={_value} onClick={_valueChanged} />;
});
ConnectToggle.propTypes = {
  hook: PropTypes.array,
};