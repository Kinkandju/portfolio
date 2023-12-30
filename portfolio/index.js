'use strict';

import i18Obj from './translate.js';

(function () {
	const ANIMATION_VIDEO = 1000;
	const ANIMATION = 500;
	const QUANTITY = 6;
	const menu = document.querySelector(".page-header__menu");
	const navigation = document.querySelector(".page-header__navigation");
	const navigationItems = document.querySelectorAll(".page-header__item");
	const themeToggle = document.querySelector(".page-header__theme");
	const langGroup = document.querySelector(".page-header__lang-group");
	const langEn = document.querySelector(".page-header__lang--en");
	const langRu = document.querySelector(".page-header__lang--ru");
	const elementsForTranslate = document.querySelectorAll("[data-i18n]");
	const seasons = ["winter", "spring", "summer", "autumn"];
	const buttonsList = document.querySelector(".buttons__list");
	const porfolioButtons = document.querySelectorAll(".buttons__item");
	const portfolioImages = document.querySelectorAll(".gallery__img");

	let langGlobal = "en";
	// let themeGlobal = "light";

	// Функция перевода
	const getTranslate = (lang) => {
		elementsForTranslate.forEach(currentElement => {
			let dataValue = currentElement.dataset.i18n;

			if (i18Obj[lang][dataValue]) {
				currentElement.textContent = i18Obj[lang][dataValue];
			};

			if (currentElement.placeholder) {
				currentElement.placeholder = i18Obj[lang][dataValue];
				currentElement.textContent = ''
			}

			if (lang === "en") {
				addClass(langEn, "page-header__lang--active");
				removeClass(langRu, "page-header__lang--active");
			} else if (lang === "ru") {
				addClass(langRu, "page-header__lang--active");
				removeClass(langEn, "page-header__lang--active");
			}
		});
	}

	// Обработчик событий клика по кнопкам смены языка
	langGroup.addEventListener("click", (evt) => {
		if (evt.target.classList.contains("page-header__lang--en")) {
			langGlobal = "en";
			getTranslate("en");
		} else {
			langGlobal = "ru";
			getTranslate("ru");
		}
	});

	// Функция добавления класса
	const addClass = (element, newClass) => {
		element.classList.add(newClass);
	}

	// Функция удаления класса
	const removeClass = (element, oldClass) => {
		element.classList.remove(oldClass);
	}

	//Функция переключения классов
	const changeClasses = (element, firstClass, secondClass,) => {
		if (!element.classList.contains(firstClass)) {
			addClass(element, firstClass);
			removeClass(element, secondClass);
		} else {
			element.classList.add(secondClass);
			removeClass(element, firstClass);
		}
	}

	//Функция переключения классов с сохранением анимации закрытия блока
	const switchClasses = (element, firstClass, secondClass, timeOfAnimation) => {
		if (!element.classList.contains(firstClass)) {
			addClass(element, firstClass);
			removeClass(element, secondClass);
		} else {
			addClass(element, secondClass);
			window.setTimeout(function () {
				removeClass(element, firstClass);
			}, timeOfAnimation);
		}
	}

	// Функция переключения темы
	const changeTheme = () => {
		changeClasses(document.body, "dark-theme", "light-theme");
		changeClasses(themeToggle, "page-header__theme--dark", "page-header__theme--light");
	}

	themeToggle.addEventListener("click", changeTheme);

	// themeToggle.addEventListener("click", () => {
	// 	if (themeToggle.classList.contains("page-header__theme--light")) {
	// 		themeGlobal = "dark";
	// 	} else if (themeToggle.classList.contains("page-header__theme--dark")) {
	// 		themeGlobal = "light";
	// 	}

	// 	changeTheme();
	// });

	document.addEventListener("DOMContentLoaded", () => {
		//Обработчик клика по кнопке меню
		menu.addEventListener("click", (evt) => {
			evt.preventDefault();

			switchClasses(navigation, "page-header__navigation--opened", "page-header__navigation--closed", ANIMATION);
			changeClasses(menu, "page-header__menu--closed", "page-header__menu--opened");
		});

		//Обработчик клика по ссылкам навигации
		for (let i = 0; i < navigationItems.length; i++) {
			navigationItems[i].addEventListener("click", () => {
				if (navigation.classList.contains("page-header__navigation--opened")) {
					switchClasses(navigation, "page-header__navigation--opened", "page-header__navigation--closed", ANIMATION);
					changeClasses(menu, "page-header__menu--closed", "page-header__menu--opened");
				}
			});
		}
	});

	//Кеширование изображений
	const preloadImages = () => {
		seasons.forEach(season => {
			for (let i = 0; i < QUANTITY; i++) {
				const img = new Image();
				img.src = `./assets/img/${season}/portfolio_${i + 1}.jpg`;
			}
		});
	}

	preloadImages();

	// Функция переключения кнопок галереи
	const changeClassActive = () => {
		for (let activeButton of porfolioButtons) {
			activeButton.addEventListener("click", function () {
				porfolioButtons.forEach((i) => removeClass(i, "buttons__item--active"));

				addClass(this, "buttons__item--active");
			});
		}
	}

	changeClassActive();

	// Функция переключения изображений
	const changeImages = () => {
		const buttonActive = document.querySelector(".buttons__item--active");
		let season = buttonActive.dataset.season;

		portfolioImages.forEach((img, i) => img.src = `./assets/img/${season}/portfolio_${i + 1}.jpg`);
	}

	buttonsList.addEventListener("click", changeImages);

	function setLocalStorage() {
		// localStorage.setItem('theme', themeGlobal);
		localStorage.setItem('lang', langGlobal);
	}

	window.addEventListener('beforeunload', setLocalStorage)

	function getLocalStorage() {
		// if (localStorage.getItem('theme')) {
		// 	themeGlobal = localStorage.getItem('theme');
		// 	changeTheme(themeGlobal);
		// }

		if (localStorage.getItem('lang')) {
			langGlobal = localStorage.getItem('lang');
			getTranslate(langGlobal);
		}
	}

	window.addEventListener('load', getLocalStorage)

	const PERSENT = 100;
	const player = document.querySelector(".video__player");
	const poster = document.querySelector(".video__poster");
	const video = player.querySelector(".video__viewer");
	const buttonPlay = player.querySelector(".video__button");
	const controls = player.querySelector(".controls");
	const togglePlay = controls.querySelector(".controls__play");
	const buttonSound = controls.querySelector(".controls__sound");
	const progressBar = controls.querySelector(".progress");
	const volumeRange = controls.querySelector(".volume");
	const skipButtons = controls.querySelectorAll(".skip");
	const fullScreen = controls.querySelector(".controls__fullscreen");

	// Функция скрытия фонового изображения
	const hidePoster = () => {
		addClass(poster, "video__poster--hide");

		window.setTimeout(function () {
			removeClass(poster, "video__poster");
		}, ANIMATION_VIDEO);
	}

	// Функция проигрывания видео
	const startPlayVideo = () => {
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}

	// Функция переключения стилей кнопок воспроизведения видео
	const updateButtonsPlay = () => {
		changeClasses(togglePlay, "controls__play", "controls__pause");
		changeClasses(buttonPlay, "video__button", "video__button--hide");
	}

	// Функция пропуска видео на 15 (в моём случае) секунд вперед и назад
	function skipVideo() {
		let value = Number(this.dataset.skip);

		video.currentTime = video.currentTime + value;
	}

	// Функция переключения стиля кнопки на беззвучный режим
	const updateButtonSound = () => {
		changeClasses(buttonSound, "controls__sound", "controls__mute");
	}

	// Функция переключения на беззвучный режим
	const muteSound = () => {
		video.muted = !video.muted;
	}

	// Функция обновления громкости звука
	function updateVolume() {
		let volume = volumeRange.value;
		let persent = volume * PERSENT;

		video.volume = volume;
		video.muted = false;

		if (video.volume === 0) {
			addClass(buttonSound, "controls__mute");
			removeClass(buttonSound, "controls__sound");
		} else {
			removeClass(buttonSound, "controls__mute");
			addClass(buttonSound, "controls__sound");
		}

		volumeRange.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${persent}%, #ffffff ${persent}%, #ffffff 100%)`;
	}

	updateVolume();

	let event = true;

	// Функция обновления прогресса воспроизведения видео
	function updateProgress() {
		if (event) {
			const persent = (video.currentTime / video.duration) * PERSENT;

			progressBar.value = persent;
			progressBar.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${persent}%, #ffffff ${persent}%, #ffffff 100%)`;
		}
	}

	// Функция изменения видео при перетаскивании
	function updateProgressDrag() {
		event = false;

		const value = this.value;
		//this.value = (video.currentTime / video.duration) * PERSENT;

		this.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${value}%, #fff ${value}%, white 100%)`;
	}

	// Функция изменения видео при отпускании
	function updateProgressDrop() {
		event = true;

		video.currentTime = progressBar.value / PERSENT * video.duration;
	}

	// Функция полноэкранного режима
	function goFullScreen() {
		if (video.requestFullScreen || video.webkitSupportsFullscreen || video.webkitRequestFullScreen || video.mozRequestFullScreen || video.msRequestFullScreen) {
			video.webkitEnterFullScreen();
		}
	}

	poster.addEventListener('click', hidePoster);
	poster.addEventListener('click', startPlayVideo);
	buttonPlay.addEventListener('click', hidePoster);
	buttonPlay.addEventListener('click', startPlayVideo);
	togglePlay.addEventListener('click', startPlayVideo);
	video.addEventListener('click', startPlayVideo);
	video.addEventListener('play', updateButtonsPlay);
	video.addEventListener('pause', updateButtonsPlay);
	video.addEventListener('timeupdate', updateProgress);
	progressBar.addEventListener('input', updateProgressDrag);
	progressBar.addEventListener('change', updateProgressDrop);
	buttonSound.addEventListener('click', updateButtonSound);
	buttonSound.addEventListener('click', muteSound);
	volumeRange.addEventListener('input', updateVolume);
	skipButtons.forEach(controls => controls.addEventListener('click', skipVideo));
	fullScreen.addEventListener('click', goFullScreen);

	const result = "Итого: 70 баллов, если видео загрузилось, оно не грузится, зараза. Если Вы знаете почему, то напишите мне, пожалуйста.\n 1) Вёрстка +10 \n 2) Кнопка Play/Pause на панели управления +10 \n 3) Прогресс-бар +10\n 4) Перемещение ползунка регулятора громкости +10\n 5) Кнопка Volume/Mute +10\n 6) Кнопка Play/Pause +10\n 7) Дополнительный функционал +10"
	console.log(result);

})();