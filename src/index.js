import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import imgArrowUp from './images/arrow-up.png';
import imgArrowDown from './images/arrow-down.png';

class Panel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_visible: false,
      expanded: false,
      animation: new Animated.Value(),
    };

    this.setMaxHeight = this.setMaxHeight.bind(this);
    this.setMinHeight = this.setMinHeight.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ is_visible: true });
    }, 100);
  }

  toggle() {
    const { expanded, maxHeight, minHeight, animation } = this.state;
    const { onPress } = this.props;

    const initialValue = expanded ? maxHeight + minHeight : minHeight;
    const finalValue = expanded ? minHeight : maxHeight + minHeight;

    this.setState({ expanded : !expanded });

    animation.setValue(initialValue);

    Animated.spring(animation, { toValue: finalValue }).start();

    if (onPress) onPress();
  }

  setMaxHeight(event) {
    const maxHeight = event.nativeEvent.layout.height
    this.setState({ maxHeight });
  }

  setMinHeight(event) {
    const minHeight = event.nativeEvent.layout.height
    this.state.animation.setValue(minHeight);
    this.setState({ minHeight });
  }

  renderHeader() {
    const { header } = this.props;
    const { expanded } = this.state;
    const icon = expanded ? imgArrowUp : imgArrowDown;

    if (typeof header === 'function') {
      return header();
    } else if (typeof header === 'string') {
      return (
        <View style={styles.button}>
          <Text style={styles.title}>{header}</Text>
          <Image style={styles.buttonImage} source={icon}/>
        </View>
      );
    } else {
      return (
        <View style={styles.button}>
          <Text style={styles.title}>
            [Must be String, or Function that {'\n'}
            render React Element]
            </Text>
          <Image style={styles.buttonImage} source={icon}/>
        </View>
      );
    }
  }

  render() {
    const { children, style } = this.props;
    const { expanded, animation } = this.state;

    return (
      <Animated.View style={[ 
        styles.container, style, {
          overflow: 'hidden',
          height: animation
        }
      ]}>
        <TouchableOpacity
          ref={ref => this._header = ref}
          activeOpacity={1}
          onPress={this.toggle}
          onLayout={this.setMinHeight}
        >
          {this.renderHeader()}
        </TouchableOpacity>
        { this.state.is_visible &&
          <View onLayout={this.setMaxHeight}>
            {children}
          </View>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {
    flex: 1,
    padding: 10,
    color: '#2a2f43',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonImage: {
    width: 30,
    height: 25,
  },
});

Panel.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  onPress: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default Panel;
