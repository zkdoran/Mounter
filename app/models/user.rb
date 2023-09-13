class User < ApplicationRecord
  has_many :sessions

  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 64 }
  validates :password, presence: true, length: { minimum: 8, maximum: 64 }

  after_validation :hash_password

  private

  def hash_password
    self.password = BCrypt::Password.create(password)
  end
end