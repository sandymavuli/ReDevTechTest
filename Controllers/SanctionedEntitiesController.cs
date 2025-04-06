using ajgre_technical_interview.Models;
using ajgre_technical_interview.Services;
using Microsoft.AspNetCore.Mvc;

namespace ajgre_technical_interview.Controllers
{
    [ApiController]
    [Route("api/sanctioned-entities")]
    public class SanctionedEntitiesController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public SanctionedEntitiesController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }


        [HttpGet]
        public async Task<IActionResult> GetSanctionedEntities()
        {
            try
            {
                var entities = await _databaseService.GetSanctionedEntitiesAsync();
                return Ok(entities);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(SanctionedEntity))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddSanctionEntityAsync([FromBody] SanctionedEntity sanctionedEntity)
        {
            if (sanctionedEntity == null)
            {
                return BadRequest("Sanctioned entity data is invalid.");
            }

            try
            {
                //this logic can be moved to business layer, also there is front end validation to check duplicate
                bool existingEntity = (await _databaseService.GetSanctionedEntitiesAsync())
                    .Any(x => x.Name == sanctionedEntity.Name && x.Domicile == sanctionedEntity.Domicile);

                if (existingEntity)
                {
                    return Conflict($"Duplicate entity exists with the same Name {sanctionedEntity.Name} " +
                        $"and Domicile {sanctionedEntity.Domicile}.");  // 409 Conflict
                }

                var addedEntity = await _databaseService.CreateSanctionedEntityAsync(sanctionedEntity);
                if (addedEntity != null)
                {
                    return CreatedAtAction(nameof(AddSanctionEntityAsync), addedEntity);
                }
                else
                {
                    return StatusCode(500, "Failed to create new sanction entity.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
