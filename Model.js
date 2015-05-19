function Model (data) {
	this._data = data || {};

	this._listeners = [];
}

Model.prototype.update = function(path, value) {
	var _path = path.split("/"),
		_data = this._data;

	for (var i = 0; i < _path.length - 1; i++) {
		var token = _path[i];

		if (!token) {
			continue;
		}

		if (!_data.hasOwnProperty(token)) {
			_data[token] = {};
		}
		_data = _data[token];
	};

	var oldValue = _data[_path[_path.length - 1]];
	_data[_path[_path.length - 1]] = value;

	this.fireUpdate(oldValue, this.get(path), path);
};

Model.prototype.get = function(path) {
	var _path = path.split("/"),
		_data = this._data;

	for (var i = 0; i < _path.length; i++) {
		var token = _path[i];

		if (!token) {
			continue;
		}

		if (!_data.hasOwnProperty(token)) {
			return;
		}
		_data = _data[token];
	};

	return _data;
};

Model.prototype.bind = function(fn, scope) {
	this._listeners.push({
		fn: fn,
		scope: scope
	});
};

Model.prototype.fireUpdate = function(oldValue, newValue, path) {
	this._listeners.forEach(function(listener) {
		listener.fn.apply(listener.fn.scope, [oldValue, newValue, path]);
	});
};

module.exports = Model;