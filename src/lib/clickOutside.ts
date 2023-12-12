const VOnClickOutside = {
  mounted: function (element: any, binding: any) {
    element.clickOutsideEvent = function (event: any) {
      const excludeComponent = document.getElementById(binding.arg)

      if (
        !(element == event.target || element.contains(event.target)) &&
        !(
          excludeComponent &&
          (event.target == excludeComponent || excludeComponent.contains(event.target))
        )
      ) {
        binding.value(event, element)
      }
    }
    document.addEventListener('click', element.clickOutsideEvent)
  },
  unmounted: function (element: any) {
    document.removeEventListener('click', element.clickOutsideEvent)
  }
}

export default VOnClickOutside
