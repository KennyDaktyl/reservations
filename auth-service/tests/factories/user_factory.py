import factory
from faker import Faker

fake = Faker()


class UserFactory(factory.Factory):
    email = factory.LazyFunction(
        fake.email
    )  # Generowanie przykładowego emaila
    role = factory.LazyAttribute(
        lambda o: fake.random_element(elements=("admin", "user"))
    )  # Generowanie roli 'admin' lub 'user'
    password = factory.LazyFunction(
        lambda: fake.password()
    )  # Generowanie przykładowego hasła

    class Meta:
        model = dict  # Używamy słownika jako modelu, bez powiązań z SQLAlchemy
