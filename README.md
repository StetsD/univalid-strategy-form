# univalid-strategy-form

Html Form Strategy for [univalid](https://github.com/StetsD/univalid) module.

Extends [univalid-strategy](https://github.com/StetsD/univalid-strategy) class

## Install

```sh
npm i univalid-strategy-form
```


## Usage

```js
const Univalid = require('univalid');
const UnivalidStrategyForm = require('univalid-strategy-form');
const univalid = Univalid();

// set strategy

univalid.setStrategy(
    UnivalidStrategyForm({
        core: univalid, /* required prop */
        $form: '.js-reg-form' /* required prop */
    })
);
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
univalid.get('clearStatuses', {/* [ nodes ] */});
```


### clearInputs(inputs)

Clear statuses of form and fields

**inputs** - Type `node or nodeList`

May be one node or array of nodes

```js
univalid.get('clearInputs', {/* [ inputs ] */});
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

**Required Prop**

This is instance 'univalid'

Must be define

## License
ISC ©
