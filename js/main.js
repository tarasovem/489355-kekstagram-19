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
var uploadImage = document.querySelector('.img-upload__preview img');
var body = document.body;

var resetForm = function () {
  uploadFileButton.value = '';
  resetFilter();
  hideEffectLevel();
  originEffectInput.checked = true;
  setScale(SCALE_DEFAULT_VALUE);
};

var openUploadWindow = function () {
  uploadWindow.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keyup', onUploadWindowEscPress);
};

var closeUploadWindow = function () {
  uploadWindow.classList.add('hidden');
  body.classList.remove('modal-open');
  resetForm();
  document.removeEventListener('keyup', onUploadWindowEscPress);
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

// Изменение масштаба изображения

var SCALE_STEP = 25;
var SCALE_MIN_VALUE = 25;
var SCALE_MAX_VALUE = 100;
var SCALE_DEFAULT_VALUE = 100;

var scaleInput = uploadWindow.querySelector('.scale__control--value');
var scaleDecreaseButton = uploadWindow.querySelector('.scale__control--smaller');
var scaleIncreaseButton = uploadWindow.querySelector('.scale__control--bigger');

var getScaleInputValue = function () {
  return scaleInput.value.slice(0, -1);
};

var setScaleEffect = function (scale) {
  uploadImage.style.transform = 'scale(' + (scale / 100) + ')';
};

var setScale = function (scale) {
  scaleInput.value = scale + '%';
  setScaleEffect(scale);
};

setScale(SCALE_DEFAULT_VALUE);

var onScaleDecreaseButtonClick = function () {
  var currentValue = getScaleInputValue();

  if (currentValue > SCALE_MIN_VALUE) {
    var newScaleValue = currentValue - SCALE_STEP;
    setScale(newScaleValue);
  }
};

scaleDecreaseButton.addEventListener('click', onScaleDecreaseButtonClick);

var onScaleIncreaseButtonClick = function () {
  var currentValue = getScaleInputValue();

  if (currentValue < SCALE_MAX_VALUE) {
    var newScaleValue = parseInt(currentValue, 10) + SCALE_STEP;
    setScale(newScaleValue);
  }
};

scaleIncreaseButton.addEventListener('click', onScaleIncreaseButtonClick);

// Наложение эффекта на изображение

var EFFECTS = {
  chrome: {
    min: 0,
    max: 1,
    precision: 2,
    units: '',
    filterName: 'grayscale'
  },
  sepia: {
    min: 0,
    max: 1,
    precision: 2,
    units: '',
    filterName: 'sepia'
  },
  marvin: {
    min: 0,
    max: 100,
    precision: 0,
    units: '%',
    filterName: 'invert'
  },
  phobos: {
    min: 1,
    max: 3,
    precision: 1,
    units: 'px',
    filterName: 'blur'
  },
  heat: {
    min: 1,
    max: 3,
    precision: 2,
    units: '',
    filterName: 'brightness'
  }
};

var effectsList = document.querySelector('.effects__list');
var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelContainer = document.querySelector('.effect-level__line');
var effectLevelPin = document.querySelector('.effect-level__pin');
var originEffectInput = document.querySelector('#effect-none');
var effect;

var hideEffectLevel = function () {
  effectLevel.classList.add('hidden');
};

var showEffectLevel = function () {
  effectLevel.classList.remove('hidden');
};

var setEffect = function (name, level) {
  var props = EFFECTS[name];

  if (!level) {
    resetFilter();
    uploadImage.classList.add('effects__preview--' + name);
    uploadImage.style.filter = props.filterName + '(' + props.max + props.units + ')';
    showEffectLevel();
  } else {
    uploadImage.style.filter = props.filterName + '(' + level + props.units + ')';
  }
};

var resetFilter = function () {
  uploadImage.removeAttribute('class');
  uploadImage.style.filter = 'none';
};

var getEffectName = function (evt) {
  var target = evt.target;
  return target.value;
};

var onFilterListChange = function (evt) {
  effect = getEffectName(evt);

  if (effect === 'none') {
    hideEffectLevel();
    resetFilter();
  } else {
    setEffect(effect);
  }
};

var getCurrentLevelWidth = function (evt) {
  var target = evt.target;

  return getComputedStyle(target).left.slice(0, -2);
};

var getMaxLevelWidth = function () {
  return getComputedStyle(effectLevelContainer).width.slice(0, -2);
};

var onEffectLevelPinMouseup = function (evt) {
  var props = EFFECTS[effect];

  var currentEffectValue = (((getCurrentLevelWidth(evt) * props.max - props.min) / getMaxLevelWidth()) + props.min).toFixed(props.precision);

  setEffect(effect, currentEffectValue);
};

effectsList.addEventListener('change', onFilterListChange);
effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseup);

// валидация хеш-тегов
var MAX_HASHTAGS_AMOUNT = 5;
var MAX_HASHTAG_CHARACTERS = 20;
var HASHTAG_PATTERN = /^([#]{1})([0-9a-zа-яё]{1,19})$/g;
var MAX_DESCRIPTION_CHARACTERS = 140;

var hashtagsInput = document.querySelector('.text__hashtags');
var descriptionInput = document.querySelector('.text__description');

var createHashtags = function (inputString) {
  return inputString.split(' ');
};

var removeAdditionalSpaces = function (allHashtags) {
  var notEmptyHashtags = [];
  for (var j = 0; j < allHashtags.length; j++) {
    if (allHashtags[j] !== '') {
      notEmptyHashtags.push(allHashtags[j]);
    }
  }
  return notEmptyHashtags;
};

var pushErrorMessage = function (message, errorMessages) {
  if (errorMessages.indexOf(message) === -1) {
    errorMessages.push(message);
  }
  return errorMessages;
};

var createValidityMessages = function (notEmptyHashtags) {
  var validityMessages = [];

  if (notEmptyHashtags.length > MAX_HASHTAGS_AMOUNT) {
    pushErrorMessage('Хеш-тегов не должно быть больше ' + MAX_HASHTAGS_AMOUNT + ' .', validityMessages);
  }

  for (var j = 0; j < notEmptyHashtags.length; j++) {
    var hashtag = notEmptyHashtags[j];
    if (!hashtag.startsWith('#')) {
      pushErrorMessage('Хеш-тег должен начинаться с символа решетки (#).', validityMessages);
    } else if (hashtag.length === 1) {
      pushErrorMessage('Хеш-тег не может состоять из одного символа.', validityMessages);
    } else if (hashtag.length > MAX_HASHTAG_CHARACTERS) {
      pushErrorMessage('Хеш-тег не может состоять из более чем ' + MAX_HASHTAG_CHARACTERS + ' символов.', validityMessages);
    } else if (!hashtag.match(HASHTAG_PATTERN)) {
      pushErrorMessage('Хеш-тег должен состоять только из букв и цифр.', validityMessages);
    } else if (notEmptyHashtags.indexOf(hashtag) !== notEmptyHashtags.lastIndexOf(hashtag)) {
      pushErrorMessage('Хеш-теги не должны повторяться.', validityMessages);
    }
  }

  return validityMessages;
};

var onHashtagsKeyup = function (evt) {
  var inputValue = hashtagsInput.value.toLowerCase();
  var dirtyHashtags = createHashtags(inputValue);
  var cleanHashtags = removeAdditionalSpaces(dirtyHashtags);
  var errors = createValidityMessages(cleanHashtags);

  if (evt.key === ESC_KEY) {
    evt.stopPropagation();
  }

  if (errors.length !== 0) {
    hashtagsInput.setCustomValidity(errors.join(' \n'));
  } else {
    hashtagsInput.setCustomValidity('');
  }
};

hashtagsInput.addEventListener('keyup', onHashtagsKeyup);


var onDescriptionKeyup = function (evt) {
  var inputValue = descriptionInput.value;

  if (evt.key === ESC_KEY) {
    evt.stopPropagation();
  }

  if (inputValue.length > MAX_DESCRIPTION_CHARACTERS) {
    descriptionInput.setCustomValidity('Длина комментария не должна превышать ' + MAX_DESCRIPTION_CHARACTERS + ' символа');
  } else {
    descriptionInput.setCustomValidity('');
  }
};

descriptionInput.addEventListener('keyup', onDescriptionKeyup);
