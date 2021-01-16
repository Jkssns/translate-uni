export default {
    /* 是否是pc端 */
    isPc() {
        const userAgentInfo = navigator.userAgent;
        const Agents = [
            "Android",
            "iPhone",
            "SymbianOS",
            "Windows Phone",
            "iPad",
            "iPod",
        ];
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) >= 0) {
                return false
            }
        }
        return true
    }
}





