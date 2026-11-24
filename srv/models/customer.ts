interface CustomerProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class CustomerModel {
  constructor(private props: CustomerProps) {}

  public static create(props: CustomerProps): CustomerModel {
    return new CustomerModel(props);
  }

  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): string {
    return this.props.email;
  }

  public setDefaultEmailDomain(): CustomerModel {
    const domain = "example.com";

    if (!this.props.email?.includes("@")) {
      this.props.email = `${this.props.email}@${domain}`;
    }

    return this;
  }

  public toObject(): CustomerProps {
    return { ...this.props };
  }
}
