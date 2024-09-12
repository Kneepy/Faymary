export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("click-outside", {
        created(el, binding) {
            el.clickOutsideEvent = event => {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value();
                }
            };
            document.addEventListener("click", el.clickOutsideEvent, false);
        },
        unmounted(el) {
            document.removeEventListener("click", el.clickOutsideEvent, false)
        }
    })
})