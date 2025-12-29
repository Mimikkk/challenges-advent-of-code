use std::cell::RefCell;
use std::collections::HashMap;
use std::hash::Hash;

pub struct MemoFn<Func, Input, Output> {
    func: Func,
    cache: RefCell<HashMap<Input, Output>>,
}

impl<Func, Input, Output> MemoFn<Func, Input, Output>
where
    Input: Eq + Hash + Clone,
    Output: Clone,
    Func: Fn(Input) -> Output,
{
    pub fn clear(&mut self) {
        self.cache.borrow_mut().clear();
    }

    pub fn call(&self, args: Input) -> Output {
        let cache = self.cache.borrow_mut();

        if let Some(result) = cache.get(&args) {
            return result.clone();
        }
        drop(cache);

        let result = (self.func)(args.clone());

        self.cache.borrow_mut().insert(args, result.clone());
        result
    }
}

pub fn memo<Func, Input, Output>(func: Func) -> impl FnMut(Input) -> Output
where
    Input: Eq + Hash + Clone,
    Output: Clone,
    Func: Fn(Input) -> Output,
{
    let mut cache: HashMap<Input, Output> = HashMap::new();

    return move |args: Input| {
        if let Some(result) = cache.get(&args) {
            return result.clone();
        }

        let result = (func)(args.clone());
        cache.insert(args, result.clone());
        result
    };
}

fn main() {
    let mut func = memo(|args: i32| -> i32 {
        println!("function call: {:?}", args);
        args
    });

    println!("Hello, world!");
}
