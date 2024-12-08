use std::fs;
use std::io::Read;

fn main() {
    println!("Hello, world!");
    let mut file = fs::File::open("input/day-1.txt").expect("Could not open file");
    let mut content = String::new();
    file.read_to_string(&mut content).expect("Could not read file");
    let content = content.split("\n");
    let content: Vec<&str> = content.map(|x| "| {x}".to_string()).collect();
    let content: str = content.split(|x| "| {x}")
    println!("File contents:{content}");
}
