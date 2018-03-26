'use strict';

const {checkOption, checkSelector, collectNodes, collectPackage, setResult} = require('./lib/univalid-strategy-form-services');
const UnivalidStrategy = require('univalid-strategy');
const keyLogger = require('univalid-key-logger')();
const {passScore} = require('pass-power');
const axios = require('axios');
const serialize = require('form-serialize');

module.exports = (opt) => {
	let _controller = {
		submit(){
			this.$form.addEventListener('submit', e => {
				e.preventDefault();
				this.core.emit('e:submit', this.core, e);
				this.core.check(collectNodes(this.$form));

				if(this.core.getCommonState === 'success'){
					this.send();
				}
			}, false);
		},
		blur(){
			if(this.keyLogger){
				let inputs = collectNodes(this.$form);

				inputs.forEach(input => {
					input.addEventListener('blur', e => {
						this.core.emit('e:blur', this.core, e);
						var elem = e.target,
							val = elem.value,
							tag = elem.tagName,
							type = elem.type,
							validType = elem.getAttribute('data-f');

						if(val && tag === 'INPUT' && type === 'text'){
							if(keyLogger.logXss(val)){
								this.clearInputs(elem);
							}
							if(validType){
								if(!keyLogger.applyFilter(validType, val)){
                                    this.core.check([elem]);
								}
							}
						}
					});
				});
			}
		},
		focus(){
			collectNodes(this.$form)
				.forEach(elem => {
					elem.addEventListener('focus', e => {
						this.core.emit('e:focus', this.core, e);
						this.clearStatuses([e.target]);
					}, false);
				});
		},
		keyup(){
			if(this.keyLogger){
				let inputs = collectNodes(this.$form);

				inputs.forEach(input => {
					input.addEventListener('keyup', e => {
						this.core.emit('e:keyup', this.core, e);
						if(e.key !== 'Tab'){
							let elem = e.target,
								val = elem.value,
								validType = elem.getAttribute('data-f');

							if(!keyLogger.applyFilter(validType, val)){
                                this.core.check([elem]);
								return false;
							}else{
								this.clearStatuses([e.target]);
							}
						}
					});
				});
			}

			if(this.checkPassScore){
				if(this.checkPassScore.target){
					this.$form.querySelector(this.checkPassScore.target).addEventListener('keyup', e => {
						this.checkPassScore.cb && this.checkPassScore.cb(passScore(e.target.value, this.passConfig.min, this.passConfig.analysis).power);
					});
				}

			}
		}
	};

	class UnivalidStrategyForm extends UnivalidStrategy {
	    constructor(opt){
	        super();

			if(opt){
				if(!opt.core){
					return console.warn(new Error("Don't finded the 'core' field during initialized UnivalidStrategyForm. This filed is required. See more to link ..."));
				}

				//Required props
				this.core = opt.core;
				this.$form = checkSelector(
					checkOption('$form', opt.$form, 'string', true, err => this.core.emit('error', err)),
					true,
					err => this.core.emit('error', err)
				);
				if(!this.$form)
					return;
				//Option props
				this.clsConfig = checkOption('clsConfig', opt.clsConfig, 'object', false, err => this.core.emit('error', err)) || {error: 'error', success: 'success'};
				this.passConfig = checkOption('passConfig', opt.passConfig, 'object', false, err => this.core.emit('error', err)) || {min: 6, analysis: ['hasUppercase', 'hasLowercase', 'hasDigits', 'hasSpecials']};
				this.statusConfig = checkOption('statusConfig', opt.statusConfig, 'object', false, err => this.core.emit('error', err));
				this.sendConfig = checkOption('sendConfig', opt.sendConfig, 'object', false, err => this.core.emit('error', err));
				this.keyLogger = checkOption('keyLogger', opt.keyLogger, 'boolean', false, err => this.core.emit('error', err));
				this.checkPassScore = checkOption('checkPassScore', opt.checkPassScore, 'object', false, err => this.core.emit('error', err));

				this.controller();
			}else{
				return console.warn(new Error("Don't finded the 'core' field during initialized UnivalidStrategyForm. This filed is required. See more to link ..."));
			}
	    }

		clearStatuses(pack){
			this.core.emit('clear:statuses', this.core, pack);
			this.$form.classList.remove(`${this.clsConfig.error}`, `${this.clsConfig.success}`);

			if(!this.statusConfig || !this.statusConfig.targetParent){
				return this.core.emit('error', 'Not determined "statusConfig" property in UnivalidStrategyForm. Can`t clear statuses');
			}

			pack.forEach(elem => {
				let parent = elem.closest(this.statusConfig.targetParent),
					statusContainer = parent.querySelector(this.statusConfig.targetStatus);

				parent.classList.remove(this.clsConfig.error, this.clsConfig.success);
				elem.classList.remove(this.clsConfig.error, this.clsConfig.success);

				if(statusContainer){
					statusContainer.innerText = '';
				}
			});
		}

		send({
			newAjaxBody = this.sendConfig || {},
			cbSendSuccess = this.sendConfig ? this.sendConfig.cbSendSuccess : null,
			cbSendError = this.sendConfig ? this.sendConfig.cbSendError : null,
		} = {}){
			if(newAjaxBody){
				this.core.emit('send:form', this.core);
                let type = !newAjaxBody.type ? this.$form.getAttribute('method') : newAjaxBody.type,
                    url = !newAjaxBody.url ? this.$form.getAttribute('action') : newAjaxBody.url,
                    data = !newAjaxBody.data ? serialize(this.$form, {hash: true}) : newAjaxBody.data,
					notDisableSubmit = newAjaxBody.notDisableSubmit;
				let $submit = this.$form.querySelector('[type="submit"]');

				$submit && !notDisableSubmit ? $submit['disabled'] = true : null;

				if(!type){
					return this.core.emit('error', 'Http Method is not defined. Define it in attributes "send" method or html attribute of form "method"');
				}
				if(!url){
					return this.core.emit('error', 'Url to send is not defined. Define it in attributes "send" method or html attribute of form "action"');
				}

				axios[type.toLowerCase()](url, data)
					.then(res => {
						$submit && !notDisableSubmit ? $submit['disabled'] = false : null;
						this.clearInputs();
						cbSendSuccess && cbSendSuccess(res, this);
					})
					.catch(err => {
						$submit && !notDisableSubmit ? $submit['disabled'] = false : null;
						cbSendError && cbSendError(err, this);
					})
			}
		}

        check(pack = collectNodes(this.$form)){
            this.core.clearState();

	        let packageValidation = collectPackage(pack, this.$form, err => this.core.emit('error', err));

			for(let i = 0; i < packageValidation.length; i++){
                this.core.validate(packageValidation[i]);
			}

			this.clearStatuses(pack);
            setResult(this.core.getState, this, err => this.core.emit('error', err));
	    }

		clearInputs(inputs){
			this.core.emit('clear:inputs', this.core);
			if(!inputs){
				this.$form.reset();
			}else{
				if(inputs.length > 1){
					inputs.forEach(elem => caseInput(elem));
				}else{
					caseInput(inputs);
				}
			}

			function caseInput(elem){
				elem = elem.length && elem.tagName !== 'SELECT' ? elem[0] : elem;
				let tag = elem.tagName,
					type = elem.getAttribute('type');

				if(tag == 'INPUT' && type !== 'radio' && type !== 'checkbox'){
					elem.value = '';
				}else if(type == 'radio' || type == 'checkbox'){
					elem['checked'] = false;
				}else if(tag == 'SELECT'){
					if(!elem.multiple){
						elem.options[0]['selected'] = true;
					}else{
						for(let i = 0; i < elem.options.length; i++){
							elem.options[i]['selected'] = false;
						}
					}
				}
			}
		}

		addEvent(events){
			if(events){
				for(var e in events){
					if(_controller[e]){
						return this.core.emit('error', 'This event name is already exist');
					}else{
						_controller[e] = events[e];
						this.controller(e);
					}
				}
			}
		}

		disable(){
			collectNodes(this.$form)
				.forEach(elem => {
					elem.disabled = true;
				});
		}

		enable(){
			collectNodes(this.$form)
				.forEach(elem => {
					elem.disabled = false;
				});
		}

	    getValidationHandlers(){
	        return this.validHandlers;
	    }

		set(option, val){
			this[option] = val;
		}

		get(val){
			return this[val];
		}

		controller(event){
			if(event){
				_controller[event].call(this);
			}else{
				for(let e in _controller){
					_controller[e].call(this);
				}
			}

		}
	}

	return new UnivalidStrategyForm(opt);
};
