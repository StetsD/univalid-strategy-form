'user strict';

function checkOption(name, opt, type, required, cbErr){
	if(!opt && required){
		cbErr(`The "${name}" option is required`);
		return null;
	}

	if(opt && typeof opt !== type){
		cbErr(`The "${name}" option must has "${type}" type`);
		return null;
	}

	return opt;
}

function checkSelector(slc, unique, cbErr){
	if(slc){
		var nodeList = document.querySelectorAll(slc);

		if(!nodeList[0]){
			cbErr(`Can't find a "${slc}" selector`);
			return null;
		}

		if(unique && nodeList.length > 1){
			cbErr(`The "${slc}" selector must be unique node`);
			return null;
		}

		return nodeList[0];
	}
}

function collectNodes(form, node){
	let nodes = [];

	if(node){
		nodes.push(node);
	}else{
		nodes = [].slice.call(form.querySelectorAll('input, select, textarea'));
	}

	return nodes;
}

function collectPackage(nodes, cbErr){
	let packageValidation = [];
	let mapFields = {};

	if(nodes && nodes.length){
		for(let i = 0; i < nodes.length; i++){
			let elem = nodes[i];
			let tagname = elem.tagName,
				inputType = elem.type,
				name = elem.getAttribute('name');

			if(name){
				if(mapFields[name]){
					if(inputType !== 'radio'){
						cbErr(`The field ${name} is dublicate`);
					}
					continue;
				}

				mapFields[name] = true;

				let type = elem.hasAttribute('data-validation') ?
						elem.getAttribute('data-validation') === '' ?
						 	'required' : elem.getAttribute('data-validation')
						: undefined,
					filter = elem.getAttribute('data-f'),
					msg = elem.getAttribute('data-msg');

				if(typeof type === 'undefined')
					continue;

				if(msg){
					try{
						msg = JSON.parse(msg);
					}catch(e){
						cbErr(`Not valid json structure in data-msg of ${name} field`);
					}
				}

				let item = {name, type, val: getValue(elem, name, tagname, inputType)};

				if(filter)
					item.filter = filter;
				if(msg)
					item.msg = msg;

				packageValidation.push(item);
			}

		}

		return packageValidation;
	}

	function getValue(elem, name, tagname, inputType){
		if(tagname === 'SELECT'){
			let options = elem.options,
				selected = options[elem.selectedIndex];

			if(!selected)
				return '';

			if(options[0].disabled && selected.value === options[0].value){
				return '';
			}

			return selected.value;
		}

		if(inputType === 'radio'){
			let groupRadio = document.querySelectorAll(`[name="${name}"]`);
			for(let i = 0; i < groupRadio.length; i++){
				if(groupRadio[i].checked){
					return groupRadio[i].value;
				}
				if(i === groupRadio.length - 1){
					return '';
				}
			}
		}

		if(inputType === 'checkbox'){
			if(elem.checked)
				return elem.value;

			return '';
		}

		return elem.value;
	}
}

function setResult(pack, formSt, cbErr){
	if(!formSt.statusConfig || !formSt.statusConfig.targetParent){
		cbErr('Nowhere to set errors. Not determined "statusConfig" property in UnivalidStrategyForm');
		return;
	}

	var notInputStatus = 0;

	if(pack && pack.length){
		let {targetParent, targetStatus, successStatus} = formSt.statusConfig,
			lastStatus = formSt.core.getCommonState;

		formSt.$form.classList.add(formSt.clsConfig[lastStatus]);

		pack.forEach(elem => {
			let input = document.querySelector(`[name="${elem.name}"]`),
				inputParent = input.closest(targetParent),
				inputStatus = inputParent.querySelector(targetStatus);

			if(elem.state === 'error'){
				injectMsg(input, inputStatus, inputParent, elem);
			}else{
				successStatus && injectMsg(input, inputStatus, inputParent, elem);
			}
		});

		if(notInputStatus)
			cbErr(`Not find "${targetStatus}" selector in one of more "${targetParent}"`);
	}



	function injectMsg(input, statusCont, parent, elem){
		if(statusCont){
			statusCont.innerText = elem.msg;
		}else{
			notInputStatus++;
		}

		parent.classList.add(formSt.clsConfig[elem.state]);
		input.classList.add(formSt.clsConfig[elem.state]);
	}
}

module.exports = {checkOption, checkSelector, collectNodes, collectPackage, setResult};
