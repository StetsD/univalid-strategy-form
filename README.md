# univalid-strategy-form

Html Form Strategy for [univalid](https://github.com/StetsD/univalid) module.

Extends [univalid-strategy](https://github.com/StetsD/univalid-strategy) class

## Install

##### You need also install [univalid](https://github.com/StetsD/univalid) module, it is a core of validation, which manage different strategies.

```sh
npm i univalid
npm i univalid-strategy-form
```


## Usage

```js
const univalid = require('univalid')();
const UnivalidStrategyForm = require('univalid-strategy-form');

// Base initialize (set strategy)

univalid.setStrategy(
    UnivalidStrategyForm({
        core: univalid, /* required prop */
        $form: '.js-reg-form' /* required prop */
    })
);
```

## Setting data-validation in .html

Add to your html form elements (inputs, selects, textarea) 'data-validation=[type]'

In current time supports next types:

- **required**
- **email**
- **password**
- **equal** - (equal password type)

```html
<div class="form-group">
    <label>Username</label>
    
    <input 
        type="text" 
        name="username" 
        class="form-control" 
        data-validation="required">
        
    <div class="form__msg"></div>
</div>
```


## Setting your custom data-validation in .html / js

Do not forget that you have opportunity to set your custom validation handler.

Like this:

#### In .html
```html
<div class="form-group">
    <label>Username</label>
    
    <input 
        type="text" 
        name="username" 
        class="form-control" 
        data-validation="my:valid">
        
    <div class="form__msg"></div>
</div>
```

#### In .js
```js
//input the 'example'
univalid.setValidHandler({ 
  'my:valid': val => { 
    if(val.match(/^example$/)){ 
      return true; 
    }else{ 
      return false; 
    } 
  } 
});
```

[Also see](https://github.com/StetsD/univalid#setvalidhandlerpack)

## Setting data-msg in .html

You are also can define message (empty, invalid, filter, success) for individual input

Add to your html form elements (inputs, selects, textarea) 'data-msg=[type]'

type:
- **empty**
- **invalid** - ValidationHandler error
- **filter** - Filter error ([univalid-key-logger](https://github.com/StetsD/univalid-key-logger) module)
- **success**

##### ! data-msg must be a valid JSON type

```html
<div class="form-group">
    <label>Username</label>
    
    <input 
        type="text" 
        name="username" 
        class="form-control" 
        data-validation="required" 
        data-msg='{"empty":"This Filed empty", "invalid": "This Field Invalid", "filter": "Latin Only", "success": "Is Ok"}'>
        
    <div class="form__msg"></div>
</div>
```

- [Also see](https://github.com/StetsD/univalid#setmsgconfigconfig) how to set and edit default 'msgConfig'
- [Also see](https://github.com/StetsD/univalid#setdefaultmsgconfigconfig) how to set common global 'msgConfig' for collections of forms
- [Also see](https://github.com/StetsD/univalid#toggledefaultmsgconfig) how to toggle form on common global 'msgConfig'


## Setting data-f in .html

You can define filer`s handler for individual input

It Handled 'keyboard' events

Add to your html form elements (inputs, selects, textarea) 'data-f=[type]'

In current moment available patterns supporting types:

- **oL** - only latin symbols
- **oC** - only cyrillic symbols
- **oN** - only numbers
- **oP** - only numbers and latin symbols

```html
<div class="form-group">
    <label>Username</label>
    
    <input 
        type="text" 
        name="username" 
        class="form-control" 
        data-f="oL" 
        data-validation="required">
    
    <div class="form__msg"></div>
</div>
```

## API


### check(pack, core)

Validating the pack

**pack** - Type `object`

Structure of pack must be strict. Like that:

name, val, type - required fields
```js
//name, val, type - required fields

[
    {
        name: 'username',
        val: 'Uriy',
        type: 'required',
        filter: 'oL',
        msg: {
            empty: 'You shall not pass',
            invalid: 'Validation error',
            filter: 'Filter error',
            success: 'All right'
        }
    },
    {
        name: 'email',
        val: 'Uriy@mzf.com',
        type: 'email',
        filter: /[a-z]|\s/gi,
        msg: {
            empty: 'You shall not pass',
            invalid: 'Bad email',
            filter: 'Only lat/numbers/specials symbols',
            success: 'All right'
        }
    },
]
```

**core** - Type `object`

The instance of 'univalid' module


### send(options)

Send form method

**options** - Type `object` - Default `sendConfig` option

**options.newAjaxBody** - Type `object`

New Ajax body config include:

- newAjaxBody.type - Type `string` - (if set 'method', that bind html attribute method)
- newAjaxBody.url - Type `string` - (if set 'action', that bind html attribute action)
- newAjaxBody.data - data of form
- newAjaxBody.notDisableSubmit - Type `boolean`


**options.cbSendSuccess** - Type `function`

**options.cbSendError** - Type `function`

```js
univalid.get('send', {/* options */});
```


**core** - Type `object`

The instance of 'univalid' module


### clearStatuses(pack)

Clear statuses of form and fields

**pack** - Type `nodeList`

Pack of html nodes inputs, selects, textareas

```js
univalid.get('clearStatuses', [/* [ nodes ] */]);
```


### clearInputs(inputs)

Clear input values

**inputs** - Type `node or nodeList`

May be one node or array of nodes

```js
univalid.get('clearInputs', [/* [ inputs ] */]);
```


### addEvent(events)

Add new event in form

**events** - Type `object`

May be one event or object of events

```js
univalid.get('addEvent', {
    ClickInDocument(){ document.addEventListener('click', ()=>{
	    console.log('Click!')
    })}
});
```


### disable()

Disable all inputs, selects, textareas

```js
univalid.get('disable');
```


### enable()

Enable all inputs, selects, textareas

```js
univalid.get('enable');
```


### getValidationHandlers()

Get validation handlers.

By default defined in [univalid-strategy](https://github.com/StetsD/univalid-strategy) abstract class


### set(option, val)

Set the option in instance

**option** - Type `string`

```js
univalid.set('passConfig', {min: 10, analysis: ['hasLowercase', 'hasDigits', 'hasSpecials']});
```


### get(prop)

Get the prop

**prop** - Type `string`

```js
univalid.get('passConfig');
```


## OPTIONS


### core

Type `object`

**! Required Prop**

This is instance 'univalid' module

Must be define on init 


### $form

Type `string`

**! Required Prop**

Form selector


### clsConfig

Type `object`

Default `{error: 'error', success: 'success'}`

ClassName config


### passConfig

Type `object`

Default `{min: 6, analysis: ['hasUppercase', 'hasLowercase', 'hasDigits', 'hasSpecials']`

Password config

```js
univalid.set('passConfig', {
    min: 10,
    analysis: ['hasUppercase']
});
```


### statusConfig

Type `object`

Statuses config

```js
univalid.set('statusConfig', {
    targetParent: '.form-group',
    targetStatus: '.form__msg',
    successStatus: true /* if show success status */
});
```


### sendConfig

Type `object`

SendForm config

```js
univalid.set('sendConfig', {
    type: 'method',
    url: '/form',
    notDisableSubmit: true
});
```


### keyLogger

Type `boolean`

On\off keyLogger filters

```js
univalid.set('keyLogger', true);
```


### checkPassScore

Type `object`

CheckPasswordScore config

```js
univalid.set('checkPassScore', {
    target: 'input[type="password"]',
    cb: val => {
        console.log(val);
    }
});
```


## UNIVALID API

Do not forget that you are also may use all methods from API univalid module.

**Several examples**
```js
// getCommonState - return common state ('success' or 'error')
univalid.get('check');
if(univalid.getCommonState === 'success'){
    univalid.get('send');
}


// getState - return last state of validation
univalid.get('check');
console.log(univalid.getState);


// clearState - clear last state of validation
univalid.get('check');
console.log(univalid.getState);
univalid.clearState();

// getStrategy - return current strategy
console.log(univalid.getStrategy);

// getValidHandler - return current validation handlers
console.log(univalid.getValidHandler);
```


## EVENTS

You can subscribe on univalid or univalid-strategy-form events.

```js

univalid.on('start:valid', (args) => {
    console.log('Check!');
});

```

**Table of events**

| Event | Description |
|:------:|:-----------:|
|start:valid|Start validation pack|
|end:valid|End validation pack|
|start:valid:field|Start validation field|
|end:valid:field|End validation field|
|change:strategy|Change strategy event|
|set:new-ValidationHandler|Set new ValidationHandler event|
|change:msg-config|Change message config event|
|clear:state|Clear state of last validation event|
|e:submit|Submit form|
|e:blur|Blur event on current input|
|e:focus|Focus event on current input|
|e:keyup|Keyup event on current input|
|error|Error event|
|clear:statuses|Clear statuses event|
|send:form|Send form event|
|clear:inputs|Clear inputs|

## License
ISC ©
