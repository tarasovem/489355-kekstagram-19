'use strict';

var MESSAGES_LIST = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAME_LIST = [
  'Артем',
  'Михаил',
  'Вадим',
  'Денис',
  'Евгений',
  'Александр',
  'Святослав',
  'Андрей',
  'Роман',
  'Антон'
];

var similarPictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var similarPictureList = document.querySelector('.pictures');

var getRandomNumber = function (min, max) {
  var number = min + Math.random() * (max + 1 - min);
  return Math.floor(number);
};

var getMessage = function (amount) {
  var messages = [];

  for (var i = 0; i < amount; i++) {
    messages[i] = MESSAGES_LIST[getRandomNumber(0, MESSAGES_LIST.length - 1)];
  }

  return messages;
};

var createPictureList = function (amount) {
  var list = [];
  for (var i = 0; i < amount; i++) {
    list[i] = {
      url: 'photos/' + getRandomNumber(1, 25) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomNumber(15, 200),
      comments: [
        {
          avatar: 'img/avatar' + getRandomNumber(1, 6) + '.svg',
          message: getMessage(getRandomNumber(1, 2)),
          name: NAME_LIST[getRandomNumber(1, NAME_LIST.length - 1)]
        }
      ]
    };
  }
  return list;
};

var pictures = createPictureList(25);

var renderPicture = function (element) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').setAttribute('src', element.url);
  pictureElement.querySelector('.picture__likes').textContent = element.likes;
  pictureElement.querySelector('.picture__comments').textContent = element.comments[0].message.length;

  return pictureElement;
};

var renderPictureList = function (list) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPicture(pictures[i]));
  }

  list.appendChild(fragment);
};

renderPictureList(similarPictureList);

// Открытие/закрытие окна загрузки изображений
var ESC_KEY = 'Escape';

var uploadFileButton = document.querySelector('#upload-file');
var uploadCancelButton = document.querySelector('#upload-cancel');
var uploadWindow = document.querySelector('.img-upload__overlay');
var body = document.body;

var openUploadWindow = function () {
  uploadWindow.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onUploadWindowEscPress);
};

var closeUploadWindow = function () {
  uploadWindow.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFileButton.value = '';
  document.removeEventListener('keydown', onUploadWindowEscPress);
};

var onUploadFileChange = function () {
  openUploadWindow();
};

var onUploadCloseButtonClick = function () {
  closeUploadWindow();
};

var onUploadWindowEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closeUploadWindow();
  }
};

uploadFileButton.addEventListener('change', onUploadFileChange);
uploadCancelButton.addEventListener('click', onUploadCloseButtonClick);

// Наложение эффекта на изображение
var uploadImage = document.querySelector('.img-upload__preview img');
var effectsList = document.querySelector('.effects__list');
var effectLevel = document.querySelector('.img-upload__effect-level');

var hideEffectLevel = function () {
  effectLevel.classList.add('hidden');
};

var showEffectLevel = function () {
  effectLevel.classList.remove('hidden');
};

var onEffectListChange = function (evt) {
  var target = evt.target;
  var value = target.value;

  uploadImage.removeAttribute('class');

  if (value !== 'none') {
    uploadImage.classList.add('effects__preview--' + value);
    showEffectLevel();
  } else {
    hideEffectLevel();
  }
};

hideEffectLevel();

effectsList.addEventListener('change', onEffectListChange);
