import './index.html';
import './index.scss';
import {mult, sum} from './modules/calc'
import code from './img/code.png'

const imgWrap = document.querySelector('.image-js');

console.log(mult(33, 4));
console.log(sum(33, 4));

const img = new Image();
img.src = code;
img.width = 900;

imgWrap.append(img);