export default function observeOnce(observable) {
  return new Promise((resolve, reject) => {
    let subscription = observable.subscribe({
      complete() {
        resolve();
        subscription.unsubscribe();
      },
      error(err) {
        reject(err);
        subscription.unsubscribe();
      },
      next(value) {
        resolve(value);
        subscription.unsubscribe();
      }
    });
  });
}
