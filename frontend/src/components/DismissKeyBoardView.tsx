import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};
function DismissKeyBoardView({children, ...props}: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView {...props} behavior="padding" style={props.style}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyBoardView;
