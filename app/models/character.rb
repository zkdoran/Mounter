class Character < ApplicationRecord
  has_many :rosters
  has_many :users, through: :rosters

  validates :name, presence: true, length: { minimum: 1, maximum: 64 }
  validates :region, presence: true, length: { minimum: 1, maximum: 64 }
  validates :realm, presence: true, length: { minimum: 1, maximum: 64 }

  validates_uniqueness_of :name, scope: [:region, :realm]
end
