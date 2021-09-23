<template>
    <div>
        <textarea type="text" v-model="code" style="width: 100%;padding-left: 15px;letter-spacing: 1px;" maxlength="-1" focus auto-height cursor-spacing="10" auto-blur adjust-position="false" 	 />
        <button @click="confirm">确定</button>

		<p v-html="result"></p>
    </div> 
</template>

<script>
export default {
    name: 'history',
    data () {
        return {
            description: 'code',
            code: `function fn() {\n\n  return 'something'\n}\n\nfn()`,
			result: ''
        }
    },

    created () {

    },

    computed: {

    },

    methods: {
		confirm() {
			try {
				this.result = eval(this.code)
			} catch(err) {
				this.result = err
			}
		}
    }

}
</script>

<style lang="scss" scoped>
</style>