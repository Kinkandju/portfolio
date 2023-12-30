const source_folder = "src";
const project_folder = "portfolio";

const path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/",
		js: project_folder + "/",
		icon: project_folder + "/",
		img: project_folder + "/assets/img/",
		svg: project_folder + "/assets/svg/",
		fonts: project_folder + "/assets/fonts/",
		video: project_folder + "/assets/video/"
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/*.js",
		icon: source_folder + "/favicon.png",
		img: source_folder + "/assets/img/**/*.{jpg,png,gif,ico,webp}",
		svg: [source_folder + "/assets/svg/**/*.svg", "!" + source_folder + "/assets/svg/iconsprite/*.svg"],
		fonts: source_folder + "/assets/fonts/*.{woff,woff2}",
		video: source_folder + "/assets/video/*.{webm,mpg,ogg,mp4,avi,mov}"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/assets/img/**/*.{jpg,png,gif,ico,webp}",
		svg: source_folder + "/assets/svg/**/*.svg",
		video: source_folder + "/assets/video/*.{webm,mpg,ogg,mp4,avi,mov}"
	},
	clean: "./" + project_folder + "/"
}

const { src, dest } = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	sass = require("gulp-sass")(require("sass")),
	autoprefixer = require("gulp-autoprefixer"),
	groupmedia = require("gulp-group-css-media-queries"),
	svgsprite = require("gulp-svg-sprite");

const browserSync = (params) => {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

const parseHtml = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

const parseCss = () => {
	return src(path.src.css)
		.pipe(
			sass({
				outputStyle: "expanded"
			})
		)
		.pipe(
			groupmedia()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

const parseJs = () => {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

const createImages = () => {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

const createSvg = () => {
	return src(path.src.svg)
		.pipe(dest(path.build.svg))
		.pipe(browsersync.stream())
}

const svgSprite = () => {
	return gulp.src([source_folder + "/assets/svg/iconsprite/*.svg"])
		.pipe(svgsprite({
			mode: {
				stack: {
					sprite: "../icons.svg",
				}
			}
		}))
		.pipe(dest(path.build.svg))
}

const parseFonts = () => {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream())
}

const createVideo = () => {
	return src(path.src.video)
		.pipe(dest(path.build.video))
		.pipe(browsersync.stream())
}

const addFavicon = () => {
	return src(path.src.icon)
		.pipe(dest(path.build.icon))
		.pipe(browsersync.stream())
}

const watchFiles = (params) => {
	gulp.watch([path.watch.html], parseHtml);
	gulp.watch([path.watch.css], parseCss);
	gulp.watch([path.watch.js], parseJs);
	gulp.watch([path.watch.img], createImages);
	gulp.watch([path.watch.svg], createSvg);
	gulp.watch([path.watch.video], createVideo);
}

const cleanFolder = (params) => {
	return del(path.clean);
}

let build = gulp.series(cleanFolder, gulp.parallel(parseHtml, parseCss, parseJs, createImages, createSvg, svgSprite, parseFonts, createVideo, addFavicon));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.addFavicon = addFavicon;
exports.createVideo = createVideo;
exports.parseFonts = parseFonts;
exports.svgSprite = svgSprite;
exports.createSvg = createSvg;
exports.createImages = createImages;
exports.parseJs = parseJs;
exports.parseCss = parseCss;
exports.parseHtml = parseHtml;
exports.build = build;
exports.watch = watch;
exports.default = watch;