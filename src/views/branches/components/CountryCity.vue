<template>
	<div class="countryCityWrapper">
		<country-selector v-model="selectedCountry"
			placeholder="请选择国家"
			:width="300"
			:data="countryList"
			:value="countryName"
			ref="countrySelec"></country-selector>
		<v-distpicker only-province
			v-if="cityVisible"
			style="margin-top:20px;"
			@selected="handleCity"
			ref="citySelec"></v-distpicker>
	</div>
</template>

<script>
// 国家选择部分
import countryList from '@/config/country'
import CountrySelector from 'vue-country-selector'
import 'vue-country-selector/dist/countryselector.css'
// 城市选择部分
import VDistpicker from './Distpicker'
export default {
  components: {
    CountrySelector,
    VDistpicker
  },
  data () {
    return {
      selectedCountry: '',
      countryName: '',
      countryList: [],
      cityVisible: false,
      city: ''
    }
  },
  created () {
    this.countryList = countryList
  },
  methods: {
    handleCity (val) {
      this.city = `${val.province.value}`
    },
    handleCountry (val) {
      if (val) {
        let arr = this.countryList.slice()
        let obj = arr.filter(item => item.code === val)[0]
        return obj.cnName
      }
      return ''
    },
    handleResetCountry () {
      this.$refs.countrySelec._data.select = {
        code: '',
        text: ''
      }
      this.selectedCountry = ''
      this.countryName = ''
    },
    handleBackCity (val) {
      const arr = val.split('-')
      const countryListS = this.countryList.slice()
      const obj = countryListS.filter(item => item.cnName === arr[0])
      this.countryName = obj[0].cnName
      this.selectedCountry = obj[0].code
      this.city = arr[1]

      this.$nextTick(() => {
        this.$refs.countrySelec._data.select = {
          code: obj[0].code,
          text: obj[0].cnName
        }
        this.$refs.citySelec.province = arr[1]
      })
    }
  },
  watch: {
    selectedCountry (oldVal, newVal) {
      const { handleCountry } = this
      this.countryName = handleCountry(oldVal)
      if (oldVal === 'CN') this.cityVisible = true
      else this.cityVisible = false
    }
  }
}
</script>

<style lang="less">
</style>
