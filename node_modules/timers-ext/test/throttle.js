'use strict';

module.exports = function (t, a, d) {
	var called = 0, fn = t(function () { ++called; }, 50);

	fn();
	a(called, 1);
	fn();
	fn();
	a(called, 1);
	setTimeout(function () {
		a(called, 1);
		fn();
		setTimeout(function () {
			a(called, 2);
			fn();
			fn();

			setTimeout(function () {
				a(called, 2);

				setTimeout(function () {
					a(called, 3);

					setTimeout(function () {
						a(called, 3);
						d();
					}, 100);
				}, 30);
			}, 20);
		}, 30);
	}, 30);
};
