void main() {
  
  // fragmentShaderのエリア：1頂点あたり18ピクセルの大きさ
  gl_PointSize = 18.0;
  
  // MVP変換：オブジェクト座標 -> ワールド座標 -> カメラ座標 → 画面座標
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}