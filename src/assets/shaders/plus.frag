void main() {
  // gl_PointCoordを[-1, 1]の範囲に正規化
  vec2 coord = gl_PointCoord * 2.0 - 1.0;
  
  // プラスの線の太さを定義
  float thickness = 0.25;
  
  // 縦線または横線の範囲内にある場合、グレーで描画
  if (abs(coord.x) < thickness || abs(coord.y) < thickness) {
    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
  } else {
    // プラス記号の外側は破棄（透明）
    discard;
  }
}