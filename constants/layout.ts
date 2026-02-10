import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Padding ngang màn hình - đồng bộ iPhone, Samsung, máy nhỏ */
export const HORIZONTAL_PADDING = SCREEN_WIDTH <= 360 ? 16 : 24;
/** Khoảng cách giữa các nhóm form (label + input) */
export const FORM_GROUP_GAP = 16;
/** Khoảng cách giữa label và input */
export const LABEL_INPUT_GAP = 6;
/** Chiều cao ô input thống nhất */
export const INPUT_MIN_HEIGHT = 48;
/** Border radius ô input / nút */
export const INPUT_BORDER_RADIUS = 12;
/** Chiều cao nút chính */
export const BUTTON_HEIGHT = 48;
/** Padding đáy ScrollView khi có bàn phím */
export const SCROLL_BOTTOM_PADDING = 40;
/** Max width form (tránh form quá rộng trên tablet) */
export const FORM_MAX_WIDTH = 400;

export const layout = {
  horizontalPadding: HORIZONTAL_PADDING,
  formGroupGap: FORM_GROUP_GAP,
  labelInputGap: LABEL_INPUT_GAP,
  inputMinHeight: INPUT_MIN_HEIGHT,
  inputBorderRadius: INPUT_BORDER_RADIUS,
  buttonHeight: BUTTON_HEIGHT,
  scrollBottomPadding: SCROLL_BOTTOM_PADDING,
  formMaxWidth: FORM_MAX_WIDTH,
  isSmallScreen: SCREEN_WIDTH <= 360,
} as const;
