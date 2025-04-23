export const checkString = (input, name) => {
  if (!input || typeof input !== 'string'){
    throw `input for ${name} is null or not a string"`
  }
  if (input.trim().length == 0){
    throw `${name} is spaces or empty`
  }
  input = input.trim()
  if (!isNaN(input)){
    throw `${name} is invalid as it is only numbers`
  }
  
  return input;
}