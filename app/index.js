'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var ChromeextensionGenerator = module.exports = function ChromeextensionGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ 
      skipInstall: options['skip-install'],
      callback: function () {
        this.emit('dependenciesInstalled');
      }.bind(this)
      });
  });

  this.on('dependenciesInstalled', function() {
     this.spawnCommand('grunt', ['dev']);
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ChromeextensionGenerator, yeoman.generators.Base);

ChromeextensionGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
  {
    name: "name",
    message: "What's the name of your chrome extension?",
    default: "test"
  },
  {
    type: "confirm",
    name: "ifBrowserAction",
    message: "Will you use browser action in your extension?",
    default: true
  },
  {
    type: "confirm",
    name: "ifContentScript",
    message: "Will you use content script in your extension?",
    default: true
  },
  {
    type: "confirm",
    name: "ifBackground",
    message: "Will you use background in your extension?",
    default: true
  },
  {
    type: "confirm",
    name: "ifOption",
    message: "Will your extension have a option page?",
    default: false
  },
  {
    type: "confirm",
    name: "ifBuildTool",
    message: "Do you want build tool (grunt) for your project?",
    default : true
  },
  {
    type: "checkbox",
    name: "permissions",
    message: "What permissions will your extension use?",
    choices: [{
      name: "tabs",
      value:"tabs",
      checked: true
    },
    {
      name: "contextMenus",
      value: "contextMenus",
      checked: true
    },
    {
      name: "clipboardRead",
      value: "clipboardRead",
      checked: false
    },
    {
      name: "clipboardWrite",
      value: "clipboardWrite",
      checked: false
    },
    {
      name: "cookies",
      value: "cookies",
      checked: false
    },
    {
      name: "notifications",
      value: "notifications",
      checked: false
    },
    {
      name: "unlimitedStorage",
      value: "unlimitedStorage",
      checked: false
    }]
  }];

  this.prompt(prompts, function (props) {
    this.name = props.name;
    this.ifBrowserAction = props.ifBrowserAction;
    this.ifContentScript = props.ifContentScript;
    this.ifBackground = props.ifBackground;
    this.ifOption = props.ifOption;
    this.ifBuildTool = props.ifBuildTool;

    var permissions = props.permissions;
    this.permissions = props.permissions;

    function hasPermission(per) {
      return permissions.indexOf(per) !== -1;
    }

    this.tabs = hasPermission('tabs');
    this.contextMenus = hasPermission('contextMenus');
    this.clipboardRead = hasPermission('clipboardRead');
    this.clipboardWrite = hasPermission('clipboardWrite');
    this.cookies = hasPermission('cookies');
    this.notifications = hasPermission('notifications');
    this.unlimitedStorage = hasPermission('unlimitedStorage');


    cb();
  }.bind(this));
};

ChromeextensionGenerator.prototype.app = function app() {
  this.mkdir('src/js/background');
  this.mkdir('src/js/contentscript');
  this.mkdir('src/js/popup');
  this.mkdir('ext/css');
  this.mkdir('ext/images');
  this.mkdir('ext/libs');
  this.mkdir('ext/third-party');

  this.template('_package.json','package.json');
  this.template('_manifest.json','ext/manifest.json');
  this.copy('.gitignore','.gitignore');
  if (this.ifBuildTool) {
    this.copy('_Gruntfile.js','Gruntfile.js');
  }
  

  if (this.ifBackground) {
    this.copy('_background.js','src/js/background/background.js');
  }

  if (this.ifContentScript) {
    this.copy('_contentscript.js','src/js/contentscript/contentscript.js');
  }

  if (this.ifBrowserAction) {
    this.template('_popup.html','ext/popup.html');
    this.copy('_popup.js','src/js/popup/popup.js');
  }
  if (this.ifOption) {
    this.copy('_options.html','ext/options.html');
    this.copy('_options.js','src/js/options.js');
  }
};