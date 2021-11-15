import Vue from 'vue';

class Store {
    constructor(options) {
        this.state = new Vue({
            data: options.state,
        });

        this.mutations = options.mutations || {};
        this.actions = options.actions || {};
        options.getters && this.handleGetters(options.getters);
    }
    commit(eventName, params) {
        var fn = this.mutations[eventName];
        fn(this.state, params);
    }
    dispatch(eventName, params) {
        var fn = this.actions[eventName];
        fn({ commit: this.commit, dispatch: this.dispatch, state: this.state }, params);
    }
	handleGetters(getters) {
		for (let i in getters) {
			this.getters[i] = getters[i]()
		}
	}
}

const install = (Vue, options) => {
    Vue.mixin({
        beforeCreate() {   
            //vue实例属性$options是获取除了data之外的方法和属性的,options的具体内容见详情A
            if(this.$options.store){
                Vue.prototype.$store = this.$options.store;
            }
        },
    })
}
export default {
	Store,
	install
}
