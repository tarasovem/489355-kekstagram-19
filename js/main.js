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

var getRandomNubmer = function (min, max) {
  var number = min + Math.random() * (max + 1 - min);
  return Math.floor(number);
};

var messageAmount = getRandomNubmer(1, 2);

var getMessage = function (amount) {
  var messages = [];

  for (var i = 0; i < amount; i++) {
    messages[i] = MESSAGES_LIST[getRandomNubmer(0, MESSAGES_LIST.length - 1)];
  }

  return messages;
};

var createPictureList = function (amount) {
  var list = [];
  for (var i = 0; i < amount; i++) {
    list[i] = {
      url: 'photos/' + getRandomNubmer(1, 25) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomNubmer(15, 200),
      comments: [
        {
          avatar: 'img/avatar' + getRandomNubmer(1, 6) + '.svg',
          message: getMessage(messageAmount),
          name: NAME_LIST[getRandomNubmer(1, NAME_LIST.length - 1)]
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
  pictureElement.querySelector('.picture__comments').textContent = element.comments[0].message.length.toString();

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


