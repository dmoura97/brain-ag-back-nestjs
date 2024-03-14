export class Document {

  constructor(readonly value: string) {
    if (!this.validate(value)) throw new Error("Invalid document");
    this.value = this.clean(value);
  }

  private validate(cpfOrCnpj: string) {
    if (!cpfOrCnpj) return false;
    const cleanedValue = this.clean(cpfOrCnpj);
    if (this.isInvalidLength(cleanedValue)) return false;
    if (this.allDigitsAreTheSame(cleanedValue)) return false;
    if (cleanedValue.length === 11) {
      return this.validateCpf(cleanedValue)
    } else if (cleanedValue.length === 14) {
      return this.validateCnpj(cleanedValue)
    }
  }

  private clean(cpfOrCnpj: string) {
    return cpfOrCnpj.replace(/\D/g, "");
  }

  private isInvalidLength(cpfOrCnpj: string) {
    return cpfOrCnpj.length < 11 && cpfOrCnpj.length > 14;
  }

  private allDigitsAreTheSame(cpfOrCnpj: string) {
    return cpfOrCnpj.split("").every(c => c === cpfOrCnpj[0]);
  }

  private validateCpf(cpf: string) {
    const dg1 = this.calculateDigitCpf(cpf, 10);
    const dg2 = this.calculateDigitCpf(cpf, 11);
    return this.extractCheckDigit(cpf) === `${dg1}${dg2}`;
  }

  private validateCnpj(cnpj: string) {
    const dg1 = this.calculateDigitCpnj(cnpj.substring(0,12));
    const dg2 = this.calculateDigitCpnj(cnpj.substring(0,13));
    return this.extractCheckDigit(cnpj) === `${dg1}${dg2}`;
  }

  private calculateDigitCpf(cpfOrCnpj: string, factor: number) {
    let total = 0;
    for (const digit of cpfOrCnpj) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return (rest < 2) ? 0 : 11 - rest;
  }

  private calculateDigitCpnj(cnpj: string) {
    const SHORTLENGTH = 12;
    const SHORTFACTOR = 6;
    const LONGFACTOR = 5;

    let factor = cnpj.length === SHORTLENGTH ? SHORTFACTOR : LONGFACTOR;
    let total = 0;
    for (const digit of cnpj) {
      total += parseInt(digit) * factor++;
      if (factor === 10) {
        factor = 2;
      }
    }
    const rest = total % 11;
    return (rest === 10) ? 0 : rest;
  }

  private extractCheckDigit(cpfOrCnpj: string) {
    return cpfOrCnpj.slice(cpfOrCnpj.length - 2);
  }

}
