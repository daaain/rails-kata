class Review < ApplicationRecord
  belongs_to :product
  validates :product_id, :content, :rating, presence: true
end
