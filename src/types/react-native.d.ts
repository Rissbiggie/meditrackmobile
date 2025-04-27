import 'react-native';

declare module 'react-native' {
  export interface ViewProps {
    children?: React.ReactNode;
    style?: any;
    testID?: string;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    contentContainerStyle?: any;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEnabled?: boolean;
  }

  export interface TextProps extends ViewProps {
    children?: React.ReactNode;
    style?: any;
    numberOfLines?: number;
    onPress?: () => void;
    testID?: string;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    disabled?: boolean;
    activeOpacity?: number;
    style?: any;
  }

  export interface TextInputProps extends ViewProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: any;
    multiline?: boolean;
    numberOfLines?: number;
  }

  export interface ImageProps extends ViewProps {
    source: { uri: string } | number;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  }

  export interface ActivityIndicatorProps extends ViewProps {
    size?: 'small' | 'large' | number;
    color?: string;
    animating?: boolean;
  }

  export class View extends React.Component<ViewProps> {}
  export class ScrollView extends React.Component<ScrollViewProps> {}
  export class Text extends React.Component<TextProps> {}
  export class TouchableOpacity extends React.Component<TouchableOpacityProps> {}
  export class TextInput extends React.Component<TextInputProps> {}
  export class Image extends React.Component<ImageProps> {}
  export class ActivityIndicator extends React.Component<ActivityIndicatorProps> {}
} 