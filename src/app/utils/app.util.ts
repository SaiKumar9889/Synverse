export function CurrencyRenderer(params: any) {
  var usdFormate = new Intl.NumberFormat("en-IN", {
    // style: "currency",
    // currency: "INR",
    minimumFractionDigits: 2,
  });
  return usdFormate.format(params.value);
}
