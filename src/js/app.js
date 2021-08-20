'use strict';

import '../css/style.css';
import { chatConnection, send, getSocketMessage } from "./chatConnection";
import $ from 'jquery';


const DATA_ID_ATTRIBUTE_NAME = 'data-id';

const $ballForm = $('#ballForm');
const $inpColor = $('#inpColor');
const $inpSize = $('#inpSize');
const $circleContent = $('#circleContent');

const idInitBall = Date.now();
let posInitX = 50;
let posInitY = 50;


chatConnection({
    onMessage: addBall,
    onSend: sendInitBall,
    onClose: init,
});

function init(){
    const $ball = $(`[${DATA_ID_ATTRIBUTE_NAME}="${idInitBall}"]`);
    posInitX = $ball.position().left;
    posInitY = $ball.position().top;

    $ball.remove();

    chatConnection({
        onMessage: addBall,
        onSend: sendInitBall,
        onClose: init,
    });
}

$ballForm.on('submit', onBallFormSubmit);
$circleContent.on('click', onContentClick);


function onBallFormSubmit(e) {
    e.preventDefault();
    const $circleElem = $(`[${DATA_ID_ATTRIBUTE_NAME}="${idInitBall}"]`);

    send({
        type: 'update',
        payload: {
            id: idInitBall,
            color: $inpColor.val(),
            size: $inpSize.val(),
            x: $circleElem.offsetX,
            y: $circleElem.offsetY,
        }
    });

    getSocketMessage({
        onUpdateData: updateBall,
    });
}

function onContentClick(e){
    moveBall(e.offsetX, e.offsetY);
}

function addBall({payload}) {
    const $circleElem = $(`<div class="circle" data-id="${payload.id}"></div>`);
    $circleContent.append($circleElem);

    setStylesCss($circleElem, payload);
}

function setStylesCss($el, payload) {
    $el.css({
        'background-color': payload.color,
        'width': payload.size,
        'height': payload.size,
        'left': payload.x,
        'top': payload.y,
    });
}

function sendInitBall() {
    send({
        type: 'add',
        payload: {
            id: idInitBall,
            color: $inpColor.val(),
            size: $inpSize.val(),
            x: posInitX,
            y: posInitY,
        }
    });
}

function updateBall({payload}) {
    const $circleElem = $(`[${DATA_ID_ATTRIBUTE_NAME}="${payload.id}"]`);

    setStylesCss($circleElem, payload);
}

function moveBall(x, y){
    const $circleElem = $(`[${DATA_ID_ATTRIBUTE_NAME}="${idInitBall}"]`);

    send({
        type: 'update',
        payload: {
            id: idInitBall,
            color: $circleElem.css('background-color'),
            size: $circleElem.height(),
            x: x - ($circleElem.width() / 2),
            y: y - ($circleElem.height() / 2),
        }
    });

    getSocketMessage({
        onUpdateData: updateBall,
    });
}