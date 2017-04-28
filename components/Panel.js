import React, { Component } from 'react';
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
      expanded: true,
      animation: new Animated.Value(),
    };

    this.setMaxHeight = this.setMaxHeight.bind(this);
    this.setMinHeight = this.setMinHeight.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { expanded, maxHeight, minHeight, animation } = this.state;

    const initialValue = expanded ? maxHeight + minHeight : minHeight;
    const finalValue = expanded ? minHeight : maxHeight + minHeight;

    this.setState({ expanded : !expanded });

    animation.setValue(initialValue);

    Animated.spring(animation, { toValue: finalValue }).start();
  }

  setMaxHeight(event) {
    const maxHeight = event.nativeEvent.layout.height
    this.setState({ maxHeight });
  }

  setMinHeight(event) {
    const minHeight = event.nativeEvent.layout.height
    this.setState({ minHeight });
  }

  render(){
    const { children, title } = this.props;
    const { expanded, animation } = this.state;
    const icon = expanded ? imgArrowUp : imgArrowDown;

    return (
      <Animated.View style={[ styles.container, { height: animation } ]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button} 
          onPress={this.toggle}
          onLayout={this.setMinHeight}
        >
          <Text style={styles.title}>{title}</Text>
          <Image style={styles.buttonImage} source={icon}/>
        </TouchableOpacity>
        <View style={styles.body} onLayout={this.setMaxHeight}>
          {children}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden',
  },
  title: {
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
  body: {
    padding: 10,
    paddingTop: 0,
  },
});

export default Panel;
