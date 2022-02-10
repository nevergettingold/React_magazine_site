//folder 내 index.js에서 folder에 있는 파일들을 import하고 export하면, 그 파일들을 import 하는 코드를 더 깔끔하게 쓸 수 있다. (Post.js 참고)

import Grid from "./Grid";
import Image from "./Image";
import Text from "./Text";
import Input from "./Input";
import Button from "./Button";
import Spinner from "./Spinner";

export { Grid, Image, Text, Input, Button, Spinner };
