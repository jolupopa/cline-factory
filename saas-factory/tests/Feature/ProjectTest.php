<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_user_can_create_a_project(): void
    {
        /** @var \App\Models\User $user */
        $user = \Auth::user();

        $response = $this->post('/projects', [
            'name' => 'Test Project',
            'description' => 'This is a test project description.',
            'status' => 'active',
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_update_their_project(): void
    {
        /** @var \App\Models\User $user */
        $user = \Auth::user();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->put('/projects/' . $project->id, [
            'name' => 'Updated Project Name',
            'description' => 'Updated description.',
            'status' => 'completed',
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
            'status' => 'completed',
        ]);
    }

    public function test_user_cannot_update_another_users_project(): void
    {
        $otherUser = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->put('/projects/' . $project->id, [
            'name' => 'Attempted Update',
            'description' => 'Should not be updated.',
            'status' => 'archived',
        ]);

        $response->assertStatus(403); // Forbidden
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
            'name' => 'Attempted Update',
        ]);
    }

    public function test_user_can_delete_their_project(): void
    {
        /** @var \App\Models\User $user */
        $user = \Auth::user();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->delete('/projects/' . $project->id);

        $response->assertRedirect('/projects');
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_project(): void
    {
        $otherUser = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->delete('/projects/' . $project->id);

        $response->assertStatus(403); // Forbidden
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
        ]);
    }
}
