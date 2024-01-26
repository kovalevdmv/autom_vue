// Тестовая строка
const text = "Это пример с текстом: <#>Найди меня</#> внутри тегов.";

// Шаблон регулярного выражения
const regexPattern = `(?<=<#>)(.*?)(?=<\/#>)`;

// Создание регулярного выражения с помощью конструктора RegExp
const pattern = new RegExp(regexPattern, "g");

// Поиск всех совпадений в строке
const matches = text.match(pattern);

// Если найдены совпадения, извлекаем текст внутри тегов
if (matches) {
    matches.forEach(match => {
        const innerText = new RegExp(regexPattern).exec(match)[1];
        console.log(innerText);
    });
}