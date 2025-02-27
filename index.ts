function getRandomNumber(): void {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    console.log(randomNumber);
}

getRandomNumber(); // Add this line to call the function.

export default getRandomNumber;
