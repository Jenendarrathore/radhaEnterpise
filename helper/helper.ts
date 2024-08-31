
export function convertToIndianRupeesWords(amount: number): string {
    const units = [
        '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
        'eighteen', 'nineteen'
    ];

    const tens = [
        '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];

    const thousand = 'thousand';
    const lakh = 'lakh';
    const crore = 'crore';

    function convertNumberToWords(num: number): string {
        if (num === 0) return 'zero';

        let words = '';

        if (num >= 10000000) {
            words += convertNumberToWords(Math.floor(num / 10000000)) + ' ' + crore + ' ';
            num %= 10000000;
        }

        if (num >= 100000) {
            words += convertNumberToWords(Math.floor(num / 100000)) + ' ' + lakh + ' ';
            num %= 100000;
        }

        if (num >= 1000) {
            words += convertNumberToWords(Math.floor(num / 1000)) + ' ' + thousand + ' ';
            num %= 1000;
        }

        if (num >= 100) {
            words += convertNumberToWords(Math.floor(num / 100)) + ' hundred ';
            num %= 100;
        }

        if (num > 0) {
            if (num < 20) {
                words += units[num];
            } else {
                words += tens[Math.floor(num / 10)] + ' ';
                if (num % 10 > 0) {
                    words += units[num % 10];
                }
            }
        }

        return words.trim();
    }

    // Split amount into integer and decimal parts
    const [integerPartStr, decimalPartStr] = amount.toFixed(2).split('.');

    const integerPart = parseInt(integerPartStr, 10);
    const decimalPart = parseInt(decimalPartStr, 10);

    let words = convertNumberToWords(integerPart);

    if (decimalPart > 0) {
        words += ' and ' + convertNumberToWords(decimalPart) + ' paise';
    }

    return words.toUpperCase() + ' ONLY';
}
export const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-IN");
};

// Example usage
const amount = 2542.20;
console.log(convertToIndianRupeesWords(amount));
// Output: 'TWO THOUSAND FIVE HUNDRED FORTY TWO AND TWENTY PAISE ONLY'
